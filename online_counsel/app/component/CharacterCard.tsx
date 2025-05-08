type CharacterCardProps = {
  name: string;
  description: string;
  image: string;
  //onClick: () => void;
};

export default function CharacterCard({
  name,
  description,
  image,
}: //onClick,
CharacterCardProps) {
  return (
    <div
      //onClick={onClick}
      className="cursor-pointer bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition w-full sm:w-60"
    >
      <img
        src={image}
        alt={name}
        className="rounded-lg w-full h-40 object-cover mb-2"
      />
      <h2 className="text-lg font-bold">{name}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
