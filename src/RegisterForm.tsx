import { useState } from "react";
import axios from "axios";

interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

interface FormData {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  password: string;
  userType: string;
}

export default function RegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    password: "",
    userType: "PARENT",
  });

  const [message, setMessage] = useState("");
  const [parents, setParents] = useState<Parent[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://192.168.1.2:3000/auth/register",
        formData
      );
      setMessage("Kayıt başarılı!");
      console.log(res.data);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Kayıt sırasında hata oluştu";
      setMessage(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  const fetchParents = async () => {
    try {
      const res = await axios.get<Parent[]>("http://192.168.1.2:3000/auth/all");
      setParents(res.data);
    } catch (error) {
      console.error("Veriler alınamadı:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded space-y-4">
      <h1 className="text-xl font-bold">Kayıt Ol</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        {(
          ["email", "phoneNumber", "firstName", "lastName", "password"] as const
        ).map((field) => (
          <input
            key={field}
            name={field}
            type={field === "password" ? "password" : "text"}
            placeholder={field}
            value={formData[field]}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Kayıt Ol
        </button>
      </form>

      {message && <div className="text-red-500">{message}</div>}

      <button
        onClick={fetchParents}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        Verileri Getir
      </button>

      {parents.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Kayıtlı Veliler:</h2>
          <ul className="list-disc pl-5 space-y-1">
            {parents.map((parent) => (
              <li key={parent.id}>
                {parent.firstName} {parent.lastName} - {parent.email}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
