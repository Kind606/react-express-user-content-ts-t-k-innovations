import { Button } from "@mui/material";

interface ImagePrevRemoveProps {
  setImagePreview: (value: string | null) => void;
  setImage: (value: File | null) => void;
  setKeepExistingImage?: (value: boolean) => void;
}

function ImagePrevRemove({
  setImagePreview,
  setImage,
  setKeepExistingImage,
}: ImagePrevRemoveProps) {
  const removeImagePreview = () => {
    setImagePreview(null);
    setImage(null);

    if (setKeepExistingImage) {
      setKeepExistingImage(false);
    }

    // Clear the file input field
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <Button
      variant="outlined"
      sx={{ marginTop: 2, backgroundColor: "#8f7474", color: "white" }}
      onClick={removeImagePreview}
    >
      Remove Image Preview
    </Button>
  );
}

export default ImagePrevRemove;
