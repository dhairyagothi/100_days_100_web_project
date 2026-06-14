import { generatePrompt } from "@/api/generatePrompt";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useGenerateCaption = (setCaptionLogs) => {
  return useMutation({
    mutationKey: ["generate-caption"],
    mutationFn: ({ prompt, tone, uploadedFile, platform }) => {
      return generatePrompt(prompt, tone, uploadedFile, platform);
    },
    onSuccess: (data) => {
      toast.success("Caption generated!"); 
      // data can be a string (caption) or object with {caption, platform, tone}
      setCaptionLogs((prev) => [data, ...prev]);
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to generate caption. Please try again.",
      );
    },
  });
};

export default useGenerateCaption;
