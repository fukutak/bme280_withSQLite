// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import LineChart from "components/charts/LineChart";
import React, { useState, useEffect }  from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdBarChart, MdOutlineCalendarToday } from "react-icons/md";
// Assets
import { RiArrowUpSFill } from "react-icons/ri";
import {
  lineChartDataTotalSpent,
  lineChartOptionsTotalSpent,
} from "variables/charts";


function getLineChartOptionsTimeStamps() {
  return {
    chart: {
      toolbar: {
        show: false,
      },
      dropShadow: {
        enabled: true,
        top: 13,
        left: 0,
        blur: 10,
        opacity: 0.1,
        color: "#4318FF",
      },
    },
    colors: ["#4318FF", "#39B8FF"],
    markers: {
      size: 0,
      colors: "white",
      strokeColors: "#7551FF",
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      shape: "circle",
      radius: 2,
      offsetX: 0,
      offsetY: 0,
      showNullDataPoints: true,
    },
    tooltip: {
      theme: "dark",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      type: "line",
    },
    xaxis: {
      type: "datetime",
      // categories: categories, // Use the categories variable here
      labels: {
        datetimeUTC: false,
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: true,
      },
    },
    yaxis: {
      show: true,
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
      },
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
      column: {
        color: ["#7551FF", "#39B8FF"],
        opacity: 0.5,
      },
    },
    color: ["#7551FF", "#39B8FF"],
  };
}

function generateStringList(length) {
  const result = [];
  for (let i = 0; i < length; i++) {
    result.push(i);
  }
  return result;
}

function extractTimeFromDateTimeList(dataList) { // YYYY-MM-ddTHH:mm:ss ->HH:mm:ss 
  const timeList = [];
  console.log(dataList)
  for (const dateTimeString of dataList) {
    const timeString = dateTimeString.split('T')[1].split('.')[0];
    timeList.push(timeString);
  }
  return timeList;
}

function formatTimestampsToHHMM(timestamps) {// YYYY-MM-ddTHH:mm:ss ->HH:mm
  return timestamps.map((timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  });
}

function convertToTimestamps(list) {
  // DateTimeをタイムスタンプに変換
  const timestamps = [];
  for (const item of list) {
    const timestamp = new Date(item).getTime();
    timestamps.push(timestamp);
  }
  return timestamps;
}

function mergeLists(timestamps, yData) {
  const mergeData = [];
  if (timestamps.length !== yData.length) {
    console.error('Lengths of input lists do not match.');
    return mergeData; // 長さが異なる場合は空の配列を返す
  }
  for (let i = 0; i < timestamps.length; i++) {
    mergeData.push([timestamps[i], yData[i]]);
  }
  return mergeData;
}

function calculateAverageAndStdDev(numbers) {
  const average = calculateAverage(numbers);
  const stdDev = calculateStdDev(numbers, average);
  return {
    average: roundToSignificant(average, 1),
    stdDev: roundToSignificant(stdDev, 1),
  };
}

function calculateAverage(numbers) {
  const sum = numbers.reduce((total, num) => total + num, 0);
  const average = sum / numbers.length;
  return average;
}

function calculateStdDev(numbers, average) {
  const squaredDeviations = numbers.map((num) => Math.pow(num - average, 2));
  const variance = squaredDeviations.reduce((total, sqDev) => total + sqDev, 0) / numbers.length;
  const stdDev = Math.sqrt(variance);
  return stdDev;
}

function roundToSignificant(number, sigFigs) {
  if (number === 0) return 0;
  const mantissa = Math.floor(Math.log10(Math.abs(number)));
  const exponent = mantissa < 0 ? mantissa + 1 : 0;
  const significantDigits = exponent + sigFigs;
  return Number(number.toFixed(significantDigits - exponent));
}

export default function TotalSpent(props) {
  const { yData, xData, ...rest } = props;
  const [chartData, setChartData] = useState([{name: "test", data: [1]}]); // [timestamp, amount]
  const [chartXData, setChartXData] = useState(getLineChartOptionsTimeStamps());
  const [metaData, setMetaData] = useState({average: NaN, stdDev: NaN})
  useEffect(() => {
    const timestamps = convertToTimestamps(xData);
    setChartData([{name: "test", data: mergeLists(xData, yData)}]);
    setMetaData(calculateAverageAndStdDev(yData));
  }, [yData]);


  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const iconColor = useColorModeValue("brand.500", "white");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );
  return (
    <Card
      justifyContent='center'
      align='center'
      direction='column'
      w='100%'
      mb='0px'
      {...rest}>
      <Flex justify='space-between' ps='0px' pe='20px' pt='5px'>
        <Flex align='center' w='100%'>
        <Text
          me='auto'
          color={textColor}
          fontSize='xl'
          fontWeight='700'
          lineHeight='100%'>
          {props.title}
        </Text>
          <Button
            ms='auto'
            align='center'
            justifyContent='center'
            bg={bgButton}
            _hover={bgHover}
            _focus={bgFocus}
            _active={bgFocus}
            w='37px'
            h='37px'
            lineHeight='100%'
            borderRadius='10px'
            {...rest}>
            <Icon as={MdBarChart} color={iconColor} w='24px' h='24px' />
          </Button>
        </Flex>
      </Flex>
      <Flex w='100%' flexDirection={{ base: "column", lg: "row" }}>
        <Flex flexDirection='column' me='20px' mt='28px'>
          <Text
            color={textColor}
            fontSize='34px'
            textAlign='start'
            fontWeight='700'
            lineHeight='100%'>
            {metaData.average + props.unit}
          </Text>
          <Flex align='center' mb='20px'>
            <Text
              color='secondaryGray.600'
              fontSize='sm'
              fontWeight='500'
              mt='4px'
              me='12px'>
              average
            </Text>
            {/* <Flex align='center'>
              <Icon as={RiArrowUpSFill} color='green.500' me='2px' mt='2px' />
              <Text color='green.500' fontSize='sm' fontWeight='700'>
                +2.45%
              </Text>
            </Flex> */}
          </Flex>
          <Text
            color={textColor}
            fontSize='34px'
            textAlign='start'
            fontWeight='700'
            lineHeight='100%'>
            {"± " + metaData.stdDev + props.unit}
          </Text>
          <Flex align='center' mb='20px'>
            <Text
              color='secondaryGray.600'
              fontSize='sm'
              fontWeight='500'
              mt='4px'
              me='12px'>
              stdDev
            </Text>
            <Flex align='center'>
              <Icon as={RiArrowUpSFill} color='green.500' me='2px' mt='2px' />
              <Text color='green.500' fontSize='sm' fontWeight='700'>
                +2.45%
              </Text>
            </Flex>
          </Flex>
          <Flex align='center'>
            <Icon as={IoCheckmarkCircle} color='green.500' me='4px' />
            <Text color='green.500' fontSize='md' fontWeight='700'>
              Success
            </Text>
          </Flex>
        </Flex>
        <Box minH='260px' minW='80%' mt='auto'>
          <LineChart
            chartData={chartData}
            chartOptions={chartXData}
          />
        </Box>
      </Flex>
    </Card>
  );
}
