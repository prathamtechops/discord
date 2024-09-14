import FileUploadComponent from "./FileUploadComponent";
import { FormControl, FormField, FormItem, FormMessage } from "./ui/form";

interface FromProps {
  name: string;
  label: "serverImage" | "messageFile";
  form: any;
}

const FileUploadInput = ({ name, label, form }: FromProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormControl>
            <FileUploadComponent
              endpoint={label}
              onChange={field.onChange}
              value={field.value}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FileUploadInput;
