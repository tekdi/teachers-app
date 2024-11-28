import TextField from '@mui/material/TextField';

interface NumberWidgetProps {
  value: any;
  onChange: (value: any) => void;
}

const CustomNumberWidget: React.FC<NumberWidgetProps> = ({
  value,
  onChange,
  ...rest
}) => {
  const handleWheel = (event: any) => {
    if (event.target instanceof HTMLInputElement) {
      event.target.blur();
    }
  };

  return (
    <TextField
      type="number"
      value={value || ''}
      onChange={(e) =>
        onChange(e.target.value ? Number(e.target.value) : undefined)
      }
      onWheel={handleWheel}
      {...rest}
    />
  );
};

export default CustomNumberWidget;
