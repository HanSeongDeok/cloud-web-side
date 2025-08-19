import Switch from "react-switch";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Toggle = ({ checked, onChange }: ToggleProps) => {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      offColor="#888"
      onColor="#0af"
      offHandleColor="#ffffff"
      onHandleColor="#fff"
      uncheckedIcon={false}
      checkedIcon={false}
      borderRadius={6}
      className="scale-110 outline-none focus:outline-none"
      boxShadow="0 2px 4px rgba(0,0,0,0.3)"
      activeBoxShadow="none"
    />
  );
};

export default Toggle;
