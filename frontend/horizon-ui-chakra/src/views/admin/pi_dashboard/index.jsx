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
import React from "react";
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

class CurrentParameter {
  constructor(amount, changeRate, unit) {
    this.amount = amount;
    this.changeRate = changeRate;
    this.unit = unit;
  }
}

export default function UserReports() {
  //   const graphql = require('graphql');
  //   const subscription = graphql.subscribe({
  //     query: `
  //         subscription {
  //             sensorDataUpdated(dateRange: { startDate: "2024-05-10", endDate: "2024-05-10" }) {
  //                 temperature
  //                 pressure
  //                 humidity
  //             }
  //         }
  //     `,
  //     variables: {
  //         dateRange: {
  //             startDate: "2024-05-10",
  //             endDate: "2024-05-10"
  //         }
  //     },
  //     onSubscriptionData: (data) => {
  //       console.log('aaaa')
  //         console.log(data.data.sensorDataUpdated);
  //     }
  // });
  // from backend
  const currentData = {
    confortIndex: new CurrentParameter(73, 5, '/100'),
    temperature: new CurrentParameter(24.5, -5, '°C'),
    humidity: new CurrentParameter(55.3, 15, '%'),
    pressure: new CurrentParameter(1010.5, 1, 'hPa'),
    todayCommits: 45,
    totalCommits: 1032
  };

  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap='20px'
        mb='20px'>
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdAccessibility} color={brandColor} />
              }
            />
          }
          name='Comfort Index'
          value= {currentData.confortIndex.amount + currentData.confortIndex.unit}
          growth={currentData.confortIndex.changeRate}
          GrowthUnit='%'
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdDeviceThermostat} color={brandColor} />
              }
            />
          }
          name='Temperature'
          value={currentData.temperature.amount + currentData.temperature.unit}
          growth={currentData.temperature.changeRate}
          growthUnit='%'
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdWater} color={brandColor} />
              }
            />
          }
          name='Humidity'
          value={currentData.humidity.amount + currentData.humidity.unit}
          growth={currentData.humidity.changeRate}
          growthUnit='%'
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdCloud} color={brandColor} />
              }
            />
          }
          name='Pressure'
          value={currentData.pressure.amount + currentData.pressure.unit}
          growth={currentData.pressure.changeRate}
          growthUnit='%'
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)'
              icon={<Icon w='28px' h='28px' as={MdAddTask} color='white' />}
            />
          }
          name='Today Commits'
          value={currentData.todayCommits}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name='Total Commits'
          value={currentData.totalCommits}
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
