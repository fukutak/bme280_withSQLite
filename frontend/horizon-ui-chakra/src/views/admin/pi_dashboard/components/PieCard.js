// Chakra imports
import { Box, Flex, Text, Select, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import PieChart from "components/charts/PieChart";
import { pieChartData, pieChartOptions } from "variables/charts";
import { VSeparator } from "components/separator/Separator";
import React from "react";

function pieChartOptionsIndex(legends) {
  return {
    labels: legends,
    colors: ["#4318FF", "#6AD2FF", "#9AD3FF"],
    chart: {
      width: "50px",
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    hover: { mode: null },
    plotOptions: {
      donut: {
        expandOnClick: false,
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    fill: {
      colors: ["#4318FF", "#6AD2FF", "#9AD3FF"],
    },
    tooltip: {
      enabled: true,
      theme: "dark",
    },
  };
};

export default function Conversion(props) {
  const { ...rest } = props;
  const indexList = props.indexList;
  const sum = indexList.reduce((sum, element) => sum + element, 0);
  const indexPercents = indexList.map(element => Math.round((element / sum) * 100));
  const legends = ["Temperature", "Humidity", "Pressure"];

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardColor = useColorModeValue("white", "navy.700");
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  return (
    <Card p='20px' align='center' direction='column' w='100%' {...rest}>
      <Flex
        px={{ base: "0px", "2xl": "10px" }}
        justifyContent='space-between'
        alignItems='center'
        w='100%'
        mb='8px'>
        <Text color={textColor} fontSize='md' fontWeight='600' mt='4px'>
          Dominance of each index in current condition
        </Text>
        <Select
          fontSize='sm'
          variant='subtle'
          defaultValue='monthly'
          width='unset'
          fontWeight='700'>
          <option value='daily'>Daily</option>
          <option value='monthly'>Monthly</option>
          <option value='yearly'>Yearly</option>
        </Select>
      </Flex>
      <PieChart
        h='100%'
        w='100%'
        chartData={indexList}
        chartOptions={pieChartOptionsIndex(legends)}
      />
      <Card
        bg={cardColor}
        flexDirection="row"
        boxShadow={cardShadow}
        w="100%"
        p="15px"
        px="20px"
        mt="15px"
        mx="auto"
        justifyContent="center"
      >
        {indexPercents.map((percent, index) => (
          <React.Fragment key={index}>
            <Flex direction="column" py="5px" alignItems="center" me={index < indexPercents.length - 1 ? "20px" : "0"}>
              <Flex align="center">
                <Box h="8px" w="8px" bg={index === 0 ? 'brand.500' : '#6AD2FF'} borderRadius="50%" me="4px" />
                <Text fontSize="xs" color="secondaryGray.600" fontWeight="700" mb="5px">
                  {legends[index]}
                </Text>
              </Flex>
              <Text fontSize="lg" color={textColor} fontWeight="700">
                {percent} %
              </Text>
            </Flex>
            {index < indexPercents.length - 1 && <VSeparator mx="20px" />}
          </React.Fragment>
        ))}
      </Card>
    </Card>
  );
}
