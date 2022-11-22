export default function Feed({ parties = [] }: { parties: { id: string; name: string }[] }) {
  if (!parties.length) return null;

  return (
    <div>
      {parties.map((party: { id: string; name: string }) => {
        return (
          <div key={party.id} className="border-b border-black h-44 p-2">
            {party.name}
          </div>
        );
      })}
    </div>
  );
}
