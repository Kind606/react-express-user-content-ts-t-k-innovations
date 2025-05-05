import { useState, useEffect } from "react";
import { Post } from "../../types/Post";

interface PostFormProps {
  initialData?: Post;
  onSubmit: (formData: FormData) => void;
  isSubmitting: boolean;
  error?: string | null;
  submitButtonText: string;
  loadingText: string;
}

const PostForm = ({
  initialData,
  onSubmit,
  isSubmitting,
  error,
  submitButtonText,
  loadingText,
}: PostFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [keepExistingImage, setKeepExistingImage] = useState(true);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      if (initialData.image) {
        setImagePreview(initialData.image);
      }
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setKeepExistingImage(false);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!title.trim()) {
      setValidationError("Title is required");
      return;
    }

    if (!content.trim()) {
      setValidationError("Content is required");
      return;
    }

    const formData = new FormData();

    if (initialData?._id) {
      formData.append("id", initialData._id);
    }

    formData.append("title", title);
    formData.append("content", content);

    if (initialData?.image) {
      formData.append("keepExistingImage", keepExistingImage.toString());
    }

    if (image) {
      formData.append("image", image);
    }

    onSubmit(formData);
  };

  return (
    <div className="post-form">
      {validationError && (
        <div className="error-message">{validationError}</div>
      )}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image (Optional)</label>

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              {initialData?.image && (
                <div className="image-options">
                  <label>
                    <input
                      type="checkbox"
                      checked={keepExistingImage}
                      onChange={(e) => setKeepExistingImage(e.target.checked)}
                    />
                    Keep existing image
                  </label>
                </div>
              )}
            </div>
          )}

          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? loadingText : submitButtonText}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
