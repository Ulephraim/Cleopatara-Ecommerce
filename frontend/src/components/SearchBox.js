/** @format */

import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    if (query) {
      navigate(`/search/?query=${query}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <Form className="search-form" onSubmit={submitHandler}>
      <InputGroup>
        <>
          <FormControl
            type="text"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
          />
          <Button type="submit" className="button-search">
            <i className="fas fa-search left-icon"></i>
          </Button>
        </>
      </InputGroup>
    </Form>
  );
}
