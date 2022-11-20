export default function Feed({ parties = [] }: { parties: { id: string; name: string }[] }) {
  if (!parties.length) return null;

  return (
    <>
      {parties.map((party: { id: string; name: string }) => {
        return (
          <div key={party.id} className="border-b border-black p-2 h-3/4">
            {party.name}
          </div>
        );
      })}
    </>
  );
}
