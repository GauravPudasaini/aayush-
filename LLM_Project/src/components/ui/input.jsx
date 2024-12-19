const Input = ({ value, onChange, readOnly, id }) => {
    return (
      <input
        id={id}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className="p-2 border border-gray-300 rounded w-full"
      />
    );
  };
  
  export { Input };
  