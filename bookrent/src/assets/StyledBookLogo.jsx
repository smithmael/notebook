// src/components/StyledBookLogo.js
import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

const StyledBookLogo = (props) => (
  <SvgIcon {...props} viewBox="0 0 256 186">
    <path
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
      d="M 128 170.5 C 103.8 170.5, 84.2 165.2, 72.5 157.6 C 39.5 143.5, 15.5 110.8, 15.5 72 C 15.5 53.3, 21.6 36.1, 31.5 22.5 M 128 170.5 C 152.2 170.5, 171.8 165.2, 183.5 157.6 C 216.5 143.5, 240.5 110.8, 240.5 72 C 240.5 53.3, 234.4 36.1, 224.5 22.5 M 71.5 139.5 C 53.3 131.5, 37.6 116.5, 31.5 97.5 M 184.5 139.5 C 202.7 131.5, 218.4 116.5, 224.5 97.5 M 106.5 152.5 C 80.8 147.2, 59.9 132.8, 50.5 113.5 M 149.5 152.5 C 175.2 147.2, 196.1 132.8, 205.5 113.5"
    />
  </SvgIcon>
);

export default StyledBookLogo;