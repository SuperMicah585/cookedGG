import { Link } from 'react-router-dom';

export function LinkButton({ name, link }) {
  const isExternal = link?.startsWith('http');
  const className =
    'inline-block rounded-full bg-white border-1 border-black px-4 py-2 text-center font-medium !text-gray-600 hover:bg-gray-50 hover:!text-gray-700 transition-colors';

  if (isExternal) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className={className}>
        {name}
      </a>
    );
  }

  return (
    <Link to={link ?? '#'} className={className}>
      {name}
    </Link>
  );
}
