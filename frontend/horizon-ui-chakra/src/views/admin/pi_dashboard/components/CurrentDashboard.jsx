/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import Usa from "assets/img/dashboards/usa.png";
// Custom components
import MiniCalendar from "components/calendar/MiniCalendar";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React, { useState, useEffect } from "react";
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
  MdWater,
  MdDeviceThermostat,
  MdThermostat,
  MdCloud,
  MdAccessibility
} from "react-icons/md";
import CheckTable from "views/admin/pi_dashboard/components/CheckTable";
import ComplexTable from "views/admin/pi_dashboard/components/ComplexTable";
import DailyTraffic from "views/admin/pi_dashboard/components/DailyTraffic";
import PieCard from "views/admin/pi_dashboard/components/PieCard";
import Tasks from "views/admin/pi_dashboard/components/Tasks";
import TotalSpent from "views/admin/pi_dashboard/components/TotalSpent";
import WeeklyRevenue from "views/admin/pi_dashboard/components/WeeklyRevenue";
import {
  columnsDataCheck,
  columnsDataComplex,
} from "views/admin/default/variables/columnsData";
import tableDataCheck from "views/admin/default/variables/tableDataCheck.json";
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json";

// add myself
import { useQuery, useMutation, ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { ConnectingAirportsOutlined } from "@mui/icons-material";
import CurrentDashboard from "views/admin/pi_dashboard/components/CurrentDashboard";

// const client = new ApolloClient({
//   uri: 'http://localhost:5000/graphql', // Replace with your actual GraphQL server endpoint
//   cache: new InMemoryCache(),
// });

const GET_SENSOR_DATA = gql`
query{
  currentData{
    currentTimestamp
    currentTemperature
    changeRateTemperature
    currentPressure
    changeRatePressure
    currentHumidity
    changeRateHumidity
    currentComfortIndex
    changeRateComfortIndex
    todayCommits
    totalCommits
  }
  sensorDataByDateRange(dateRange: { startDate: $startDate, endDate: $endDate }) {
    temperature
    pressure
    humidity
    timestamp
  }
}
`;
// sensorDataByDateRange(dateRange: { startDate: "2024-05-11T00:00:00", endDate: "2024-05-11T23:59:59" }) {

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  const [comfortIndexAmount, setComfortIndexAmount] = useState(NaN);
  const [comfortIndexChangeRate, setComfortIndexChangeRate] = useState(NaN);
  const [temperatureAmount, setTemperatureAmount] = useState(NaN);
  const [temperatureChangeRate, setTemperatureChangeRate] = useState(NaN);
  const [humidityAmount, setHumidityAmount] = useState(NaN);
  const [humidityChangeRate, setHumidityChangeRate] = useState(NaN);
  const [pressureAmount, setPressureAmount] = useState(NaN);
  const [pressureChangeRate, setPressureChangeRate] = useState(NaN);
  const [todayCommits, setTodayCommits] = useState(NaN);
  const [totalCommits, setTotalCommits] = useState(NaN);


  const [sensorDataByDateRange, setSensorDataByDateRange] = useState(null);
  const [startDate, setStartDate] = useState("2024-05-11T00:00:00");
  const [endDate, setEndDate] = useState("2024-05-11T23:59:59");

  const { loading, error, data } = useQuery(GET_SENSOR_DATA, {
    variables: { startDate, endDate },
  });

  if(loading){
    console.log("loading中の処理を記載");
  }
  if(error){
    console.log("error時の処理を記載");
  }
  if(data){
    console.log("dataがあったときの処理を記載");
    console.log(data);
  }

  // grahpqlの処理を書く
  // client
  // .query({
  //   query: GET_SENSOR_DATA
  // })
  // .then((result) => {
  //   if (result.data) {
  //     if (result.data.currentData) {
  //       const {
  //         currentComfortIndex,
  //         changeRateComfortIndex,
  //         currentHumidity,
  //         changeRateHumidity,
  //         currentPressure,
  //         changeRatePressure,
  //         currentTemperature,
  //         changeRateTemperature,
  //         todayCommits,
  //         totalCommits
  //       } = result.data.currentData;

  //       // Update individual state variables
  //       setComfortIndexAmount(currentComfortIndex);
  //       setComfortIndexChangeRate(changeRateComfortIndex);
  //       setTemperatureAmount(currentTemperature);
  //       setTemperatureChangeRate(changeRateTemperature);
  //       setHumidityAmount(currentHumidity);
  //       setHumidityChangeRate(changeRateHumidity);
  //       setPressureAmount(currentPressure);
  //       setPressureChangeRate(changeRatePressure);
  //       setTodayCommits(todayCommits);
  //       setTotalCommits(totalCommits);
  //     } else {
  //       console.warn('No current data found in response');
  //       // Handle the case where no current data is available
  //     }
  //   } else if (result.errors) {
  //     console.error('Errors:', result.errors);
  //   }
  // })
  // .catch((error) => {
  //   console.warn("リクエストエラー:" + error);
  //   console.log(GET_SENSOR_DATA)
  // });

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
    <SimpleGrid
      columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
      gap="20px"
      mb="20px"
    >
      <MiniStatistics
        startContent={
          <IconBox
            w="56px"
            h="56px"
            bg={boxBg}
            icon={<Icon w="32px" h="32px" as={MdAccessibility} color={brandColor} />}
          />
        }
        name="Comfort Index"
        value={comfortIndexAmount + ' / 100'}
        growth={comfortIndexChangeRate}
        growthUnit="%"
      />
      <MiniStatistics
        startContent={
          <IconBox
            w="56px"
            h="56px"
            bg={boxBg}
            icon={<Icon w="32px" h="32px" as={MdDeviceThermostat} color={brandColor} />}
          />
        }
        name="Temperature"
        value={temperatureAmount + ' °C'}
        growth={temperatureChangeRate}
        growthUnit="%"
      />
      <MiniStatistics
        startContent={
          <IconBox
            w="56px"
            h="56px"
            bg={boxBg}
            icon={<Icon w="32px" h="32px" as={MdWater} color={brandColor} />}
          />
        }
        name="Humidity"
        value={humidityAmount + ' %'}
        growth={humidityChangeRate}
        growthUnit="%"
      />
      <MiniStatistics
        startContent={
          <IconBox
            w="56px"
            h="56px"
            bg={boxBg}
            icon={<Icon w="32px" h="32px" as={MdCloud} color={brandColor} />}
          />
        }
        name="Pressure"
        value={pressureAmount + ' hPa'}
        growth={pressureChangeRate}
        growthUnit="%"
      />
      <MiniStatistics
        startContent={
          <IconBox
            w="56px"
            h="56px"
            bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
            icon={<Icon w="28px" h="28px" as={MdAddTask} color="white" />}
          />
        }
        name="Today Commits"
        value={todayCommits}
      />
      <MiniStatistics
        startContent={
          <IconBox
            w="56px"
            h="56px"
            bg={boxBg}
            icon={<Icon w="32px" h="32px" as={MdFileCopy} color={brandColor} />}
          />
        }
        name="Total Commits"
        value={totalCommits}
      />
    </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
        <TotalSpent />
        <TotalSpent />
        <TotalSpent />
        <TotalSpent />
        <WeeklyRevenue />
        <WeeklyRevenue />
        <WeeklyRevenue />
        <WeeklyRevenue />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <DailyTraffic />
          <PieCard />
        </SimpleGrid>
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <Tasks />
          <MiniCalendar h='100%' minW='100%' selectRange={false} />
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );
}
