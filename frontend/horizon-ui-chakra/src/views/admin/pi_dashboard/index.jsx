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
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
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
  MdAccessibility,
  MdLockClock,
  MdOutlineCalendarToday
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
import { CatchingPokemonSharp, ConnectingAirportsOutlined } from "@mui/icons-material";
import CurrentDashboard from "views/admin/pi_dashboard/components/CurrentDashboard";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const GET_SENSOR_DATA = gql`
  query GetSensorData($startDate: DateTime!, $endDate: DateTime!) {
    currentData {
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
      comfortIndex
      timestamp
    }
  }
`;
// sensorDataByDateRange(dateRange: { startDate: "2024-05-11T00:00:00", endDate: "2024-05-11T23:59:59" }) {
// sensorDataByDateRange(dateRange: { startDate: $startDate, endDate: $endDate }) {

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    console.log(isModalOpen);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log(isModalOpen);
    setIsModalOpen(false);
  };

  // setCurrentData
  const [currentTime, setCurrentTimeStamp] = useState('');
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

  // setTimeSeriesData
  const [comfortIndicesTimeSeries, setComfortIndicesTimeSeries] = useState([]);
  const [temperatureTimeSeries, setTemperatureTimeSeries] = useState([]);
  const [humidityTimeSeries, setHumidityTimeSeries] = useState([]);
  const [pressureTimeSeries, setPressureTimeSeries] = useState([]);
  const [timeStamps, setTimeStamps] = useState([]);

  // const [startDate, setStartDate] = useState("2024-05-13T00:00:00");
  // const [endDate, setEndDate] = useState("2024-05-13T23:59:59");
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    const todayJapan = new Date(today.getTime()); // Adjust for Japan timezone (UTC+9)
    const todayStart = new Date(todayJapan.getFullYear(), todayJapan.getMonth(), todayJapan.getDate());
    todayStart.setHours(9, 0, 0, 0); // 時差を加味して9時間プラス
    return todayStart.toISOString();
  });
  
  const [endDate, setEndDate] = useState(() => {
    const today = new Date();
    const todayJapan = new Date(today.getTime()); // Adjust for Japan timezone (UTC+9)
    const todayEnd = new Date(todayJapan.getFullYear(), todayJapan.getMonth(), todayJapan.getDate());
    todayEnd.setHours(23+9, 59, 59, 999); // Set to 23:59:59.999
    return todayEnd.toISOString({ timeZone: 'Asia/Tokyo' });
  });

  const { loading, error, data } = useQuery(GET_SENSOR_DATA, {
    variables: { startDate, endDate },
  });

  if(loading){
    // loading中の処理を記載
  }
  if(error){
    // error時の処理を記載
  }

  useEffect(() => {
    if(data){
      // dataがあったときの処理を記載
      if (data.currentData) {
        const {
          currentTimestamp,
          currentComfortIndex,
          changeRateComfortIndex,
          currentHumidity,
          changeRateHumidity,
          currentPressure,
          changeRatePressure,
          currentTemperature,
          changeRateTemperature,
          todayCommits,
          totalCommits
        } = data.currentData;
  
        // Update individual state variables
        const formattedDate = new Date(currentTimestamp).toLocaleString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        setCurrentTimeStamp(formattedDate);
        setComfortIndexAmount(currentComfortIndex);
        setComfortIndexChangeRate(changeRateComfortIndex);
        setTemperatureAmount(currentTemperature);
        setTemperatureChangeRate(changeRateTemperature);
        setHumidityAmount(currentHumidity);
        setHumidityChangeRate(changeRateHumidity);
        setPressureAmount(currentPressure);
        setPressureChangeRate(changeRatePressure);
        setTodayCommits(todayCommits);
        setTotalCommits(totalCommits);
      } else {
        console.warn('No current data found in response');
        // Handle the case where no current data is available
      }
      if(data.sensorDataByDateRange){
        const comfortIndices = [];
        const temperatures = [];
        const humidities = [];
        const pressures = [];
        const timestamps = [];

        data.sensorDataByDateRange.forEach(entry => {
          comfortIndices.push(entry.comfortIndex);
          temperatures.push(entry.temperature);
          humidities.push(entry.humidity);
          pressures.push(entry.pressure);
          timestamps.push(entry.timestamp);
        });
        // setComfortIndicesTimeSeries([{name: timestamps[0], data: comfortIndices.slice(0,7)}])
        setComfortIndicesTimeSeries(comfortIndices);
        setTemperatureTimeSeries(temperatures);
        setHumidityTimeSeries(humidities);
        setPressureTimeSeries(pressures);
        setTimeStamps(timestamps);
      }
    }
  }, [data]);
  
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
            icon={<Icon w="32px" h="32px" as={MdLockClock} color={brandColor} />}
          />
        }
        name="Fetch DateTtime"
        value={currentTime}
      />
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
        growthUnit="p"
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
        growthUnit="°C"
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
        growthUnit="hPa"
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
        value={todayCommits + " / 96"}
      />
    </SimpleGrid>
    <SimpleGrid
      columns={{ base: 1, md: 3, lg: 3, "2xl": 3 }}
      gap="20px"
      mb="20px"
    >
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Select Day
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <MiniCalendar
              h="100%"
              minW="100%"
              selectRange={false}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      {/* <Button
            bg={boxBg}
            fontSize='sm'
            fontWeight='500'
            color={textColorSecondary}
            borderRadius='7px'
            onClick={openModal}
            >
            <Icon
              as={MdOutlineCalendarToday}
              color={textColorSecondary}
              me='4px'
            />
            Select Day
          </Button> */}
      <MiniStatistics
        startContent={
          <IconBox
            w="56px"
            h="56px"
            bg={boxBg}
            icon={<Icon w="32px" h="32px" as={MdWater} color={brandColor} />}
          />
        }
        name="Start Date"
        value={startDate}
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
        name="End Date"
        value={endDate}
      />
    </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        {/* <TotalSpent yData={comfortTimeSeries} xData={timeStamps} /> */}
        <TotalSpent yData={comfortIndicesTimeSeries} xData={timeStamps} title={"Comfort Index"} unit=" p"/>
        <TotalSpent yData={temperatureTimeSeries} xData={timeStamps} title={"Temperature"} unit=" °C"/>
        <TotalSpent yData={humidityTimeSeries} xData={timeStamps} title={"Humidity"} unit=" %"/>
        <TotalSpent yData={pressureTimeSeries} xData={timeStamps} title={"Pressure"} unit=" hPa"/>
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
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <Tasks />
          <MiniCalendar h='100%' minW='100%' selectRange={false} setStartDate={setStartDate} setEndDate={setEndDate}  />
        </SimpleGrid>
    <SimpleGrid
      columns={{ base: 1, md: 2, lg: 2, "2xl": 2 }}
      gap="20px"
      mb="20px"
    ></SimpleGrid>
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
    </Box>
  );
}
