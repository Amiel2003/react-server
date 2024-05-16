import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

function DetailsButton() {
  const navigate = useNavigate();

  const redirectToDetailsPage = () => {
    navigate('/403');
  };

  return (
    <Button
      variant="contained"
      color="primary"
      className="MuiButton-contained details"
      onClick={redirectToDetailsPage}
    >
      Details
    </Button>
  );
}

export default DetailsButton;
