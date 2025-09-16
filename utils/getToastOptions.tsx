import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import type { toast } from "sonner";

export function getToastOptions(): Parameters<typeof toast>[1] {
  return {
    position: "top-right",
    action: {
      label: (
        <div className="flex items-center space-x-2">
          <CloseRoundedIcon className="h-5 w-5" />
        </div>
      ),
      onClick: () => {},
    },
  };
}
