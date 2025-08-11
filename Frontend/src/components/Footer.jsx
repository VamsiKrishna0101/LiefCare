import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white text-center py-4">
      <p>&copy; {new Date().getFullYear()} Lief App. All rights reserved.</p>
    </footer>
  );
}
