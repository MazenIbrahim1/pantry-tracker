"use client"
import React from 'react';
import { AppBar, Toolbar, Box } from '@mui/material';
import Image from 'next/image';
import logo from '../../public/pantry-nest.png';
import { useRouter } from 'next/navigation';

const Header = (props) => {
  const router = useRouter()

  return (
    <AppBar style={{
        width: '100vw',
        position: 'sticky',
        backgroundColor: 'lightblue'
    }}>
      <Toolbar>
        <Box display="flex" flexDirection="row" alignItems="center" flexGrow={1}>
          <Image src={logo} alt="Pantry Nest Logo" width={220} height={60} onClick={() => router.push('/')}/>
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center">
          {props.Button}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
