"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { Cross1Icon } from "@radix-ui/react-icons";
import { FileIcon } from "lucide-react";
import Image from "next/image";

interface FileUploadComponentProps {
  endpoint: "serverImage" | "messageFile";
  onChange: (url?: string) => void;
  value: string;
}

const FileUploadComponent = ({
  endpoint,
  onChange,
  value,
}: FileUploadComponentProps) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative mx-auto   size-20">
        <Image src={value} alt="File" fill className="rounded-full " />
        <button
          onClick={() => {
            onChange("");
          }}
          className="absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white"
        >
          <Cross1Icon />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    <div className="relative mt-2 flex items-center rounded-md bg-background/10 p-2">
      <FileIcon className="size-10 fill-indigo-200 stroke-indigo-400" />
    </div>;
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res[0].url);
      }}
      onUploadError={(error) => {
        console.log("ERROR", error);
      }}
    />
  );
};

export default FileUploadComponent;
