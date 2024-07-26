import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ProductForm = () => {
  const { register, control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      name: "",
      description: "",
      image: "",
      variants: [{ size: "", color: "", quantity: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/products/${id}`
      );
      const product = response.data;
      setValue("name", product.name);
      setValue("description", product.description);
      setValue("image", product.image);
      setValue("variants", product.variants);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (id) {
        await axios.put(`http://localhost:3000/api/products/${id}`, data);
      } else {
        await axios.post("http://localhost:3000/api/products", data);
      }
      navigate("/");
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <div>
      <h1>{id ? "Edit Product" : "Add Product"}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Name:</label>
          <input type="text" {...register("name")} required />
        </div>
        <div>
          <label>Description:</label>
          <input type="text" {...register("description")} required />
        </div>
        <div>
          <label>Image URL:</label>
          <input type="text" {...register("image")} required />
        </div>
        <div>
          <label>Variants:</label>
          {fields.map((variant, index) => (
            <div key={variant.id}>
              <input
                type="text"
                {...register(`variants.${index}.size`)}
                placeholder="Size"
                required
              />
              <input
                type="text"
                {...register(`variants.${index}.color`)}
                placeholder="Color"
                required
              />
              <input
                type="number"
                {...register(`variants.${index}.quantity`)}
                placeholder="Quantity"
                required
              />
              <button
                className="button button-danger"
                type="button"
                onClick={() => remove(index)}
              >
                Remove Variant
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ size: "", color: "", quantity: 0 })}
          >
            Add Variant
          </button>
        </div>
        <button className="button button-primary" type="submit">
          {id ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
