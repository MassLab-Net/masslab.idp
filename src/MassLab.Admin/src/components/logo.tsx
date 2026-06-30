import logoFull from "@/assets/MassLab_Logo_2.png";
import logoIcon from "@/assets/MassLab_Logo_3.png";

export function Logo({ size = 40, showWord = true }: { size?: number; showWord?: boolean }) {
  const src = showWord ? logoFull : logoIcon;
  return (
    <div className="flex items-center">
      <img src={src} alt="MassLab" style={{ height: size, width: "auto" }} className="select-none" />
    </div>
  );
}
