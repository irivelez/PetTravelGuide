import CountrySelector from '../CountrySelector';

export default function CountrySelectorExample() {
  return (
    <CountrySelector
      onSearch={(origin, destination, petType) =>
        console.log('Search:', { origin, destination, petType })
      }
    />
  );
}
