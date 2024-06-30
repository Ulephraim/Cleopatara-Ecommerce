/** @format */

// Breadcrumb.js
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div className="breadcrumb">
      <Link to="/">Home</Link>
      <i className="fas fa-chevron-right"></i>
      {pathnames.map((part, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        return isLast ? (
          <span key={part}>{part}</span>
        ) : (
          <Link key={part} to={routeTo}>
            {part}
            <i className="fas fa-chevron-right"></i>
          </Link>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
