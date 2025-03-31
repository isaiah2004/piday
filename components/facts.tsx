type FactsProps = {
  title: string;
  Content: string;
};

export const Facts = ({ title, Content }: FactsProps) => {
  return (
    <div className="fact-container">
      <h2 className="text-lg font-semibold text-blue-700">{title}</h2>
      <p className="text-gray-700 mt-1">{Content}</p>
    </div>
  );
};