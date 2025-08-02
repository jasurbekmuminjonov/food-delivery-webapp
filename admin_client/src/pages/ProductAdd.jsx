import { useRef, useState } from "react";
import { FaX } from "react-icons/fa6";
import { useCreateProductMutation } from "../context/services/product.service";

const ProductAdd = () => {
  const [additionals, setAdditionals] = useState([]);
  const [newAdditional, setNewAdditional] = useState("");
  const [createProduct] = useCreateProductMutation();
  const imageRef = useRef();

  const handleAddAdditional = () => {
    if (newAdditional.trim()) {
      setAdditionals([...additionals, newAdditional.trim()]);
      setNewAdditional("");
    }
  };

  const handleRemoveAdditional = (index) => {
    setAdditionals(additionals.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    additionals.forEach((item) => formData.append("additionals[]", item));

    // const files = imageRef.current.files;
    // for (let i = 0; i < files.length; i++) {
    //   formData.append("image_log", files[i]);
    // }

    try {
      const res = await createProduct(formData).unwrap();
      console.log(res);

      alert("Mahsulot muvaffaqiyatli qo'shildi");
    } catch (err) {
      console.error("Xatolik:", err);
    }
  };

  return (
    <div className="product-add">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        encType="multipart/form-data"
      >
        <p>Tovar nomi</p>
        <input type="text" name="product_name" />
        <p>Tovar tavsifi</p>
        <textarea name="product_description" rows="5" cols="10"></textarea>
        <p>Tovar tarkibi</p>
        <textarea name="product_ingredients" rows="5" cols="10"></textarea>
        <br />
        <div>
          <div>
            <p>Tovar birligi</p>
            <select name="unit">
              <option value="dona">Dona</option>
              <option value="gr">Kilogramm</option>
              <option value="litr">Litr</option>
              <option value="sm">Santimetr</option>
            </select>
          </div>
          <div>
            <p>Birlik tavsifi</p>
            <input type="text" name="unit_description" />
          </div>
          <div>
            <p>Yaroqlilik kunlari</p>
            <input type="number" name="expiration" />
          </div>
          <div>
            <p>Sotish narxi</p>
            <input type="number" name="selling_price" />
          </div>
        </div>
        <br />
        <div>
          <div>
            <p>Kategoriya</p>
            <select name="category">
              <option value="688cab0f66ac4bb5a48e7651">Ichimliklar</option>
            </select>
          </div>
          <div>
            <p>Subkategoriya</p>
            <select name="subcategory">
              <option value="688cac0c66ac4bb5a48e7655">
                Gazli ichimliklar
              </option>
            </select>
          </div>
        </div>
        <p>Qo'shimcha malumotlar</p>
        <div>
          <input
            type="text"
            value={newAdditional}
            onChange={(e) => setNewAdditional(e.target.value)}
          />
          <button type="button" onClick={handleAddAdditional}>
            Qo'shish
          </button>
          {additionals.map((item, index) => (
            <p key={index}>
              {item}{" "}
              <button
                type="button"
                onClick={() => handleRemoveAdditional(index)}
              >
                <FaX />
              </button>
            </p>
          ))}
        </div>
        <br />
        100 gr tarkibida
        <div>
          <div>
            <p>Kkal</p>
            <input type="number" step={0.1} name="nutritional_value.kkal" />
          </div>
          <div>
            <p>Oqsillar</p>
            <input type="number" step={0.1} name="nutritional_value.protein" />
          </div>
          <div>
            <p>Yog'lar</p>
            <input type="number" step={0.1} name="nutritional_value.fat" />
          </div>
          <div>
            <p>Uglevodlar</p>
            <input type="number" step={0.1} name="nutritional_value.uglevod" />
          </div>
        </div>
        <p>Rasmlar</p>
        <input type="file" name="image_log" multiple ref={imageRef} />
        <button type="submit">Kiritish</button>
      </form>
    </div>
  );
};

export default ProductAdd;
