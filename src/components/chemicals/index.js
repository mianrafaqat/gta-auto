import { Box } from '@mui/material'
import React from 'react'
import ExpertCar from './expert-car'
import Washing from './washing'
import Packages from './package'

const Chemicals = () => {
  return (
    <Box>
        <ExpertCar />
        <Washing />
        <Packages />
    </Box>
  )
}

export default Chemicals
