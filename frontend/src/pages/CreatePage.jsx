import React from "react";
import { useNavigate } from "react-router";
import { useCreateProduct } from "../hooks/useProducts";
import { SparkleIcon } from "lucide-react";

const CreatePage = () => {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });

  const handleSubmit = (e) => {};
  return (
    <div className="max-w-lg mx-auto">
      <Link to="/" className="btn btn-ghost btn-sm gap-1 mb-4">
        <ArrowLeftIcon className="size-4" /> Back
      </Link>

      <div className="card bg-base-300">
        <div className="card-body">
          <h1 className="card-title">
            <SparkleIcon className="size-5 text-primary" />
          </h1>

          <form action={}></form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
