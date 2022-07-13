import { Box, Container, Paper, Text } from "@mantine/core"
import React from "react"
import { useLocation } from "react-router-dom"
import { Location } from "history";

interface Navigate extends Location {
  state: {
    label?: string
  }
}

export const PageError = () => {

  const location = useLocation() as Navigate
  const label = location.state?.label ?? "Cette page n'existe pas"

  return(
    <Box sx={{display: 'flex', alignItems: "center", justifyContent: "center" , height: "100vh"}}>
      <Text>
        {label}
      </Text>
    </Box>
  )
}