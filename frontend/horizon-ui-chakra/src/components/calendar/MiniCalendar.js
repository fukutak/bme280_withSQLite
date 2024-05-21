import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "assets/css/MiniCalendar.css";
import { Text, Icon } from "@chakra-ui/react";
// Chakra imports
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
// Custom components
import Card from "components/card/Card.js";

export default function MiniCalendar(props) {
  const { selectRange, setStartDate, setEndDate, ...rest } = props;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const displaySelectedDate = () => {
    return selectedDate.toLocaleDateString(); 
  };

  const handleChange = (date) => {
    setSelectedDate(date);

    const start = new Date(date);
    start.setHours(0+9, 0, 0, 0); // 00:00:00.000
    const end = new Date(date);
    end.setHours(23+9, 59, 59, 999); // 23:59:59.999


    // 選択された日付の範囲を親コンポーネントに渡す
    setStartDate(start.toISOString());
    setEndDate(end.toISOString());
  };
  return (
    <Card
      align='center'
      direction='column'
      w='100%'
      maxW='max-content'
      p='20px 15px'
      h='max-content'
      {...rest}>
      <Calendar
        onChange={handleChange}
        value={selectedDate}
        selectRange={selectRange}
        view={"month"}
        tileContent={<Text color='brand.500'></Text>}
        prevLabel={<Icon as={MdChevronLeft} w='24px' h='24px' mt='4px' />}
        nextLabel={<Icon as={MdChevronRight} w='24px' h='24px' mt='4px' />}
      />
    </Card>
  );
}
