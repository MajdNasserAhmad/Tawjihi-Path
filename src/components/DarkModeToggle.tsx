import { useEffect, useState } from 'react';

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button onClick={() => setIsDark(!isDark)} className="p-2 border rounded">
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
