'use client';

import React, { useState, useEffect } from 'react';

import DatePicker, { DayRange, Day } from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";

import moment from 'jalali-moment';
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { Button } from '../ui/button';
import { CalendarIcon } from 'lucide-react';

interface PersianDatePickerProps {
    selectedDayRange: DayRange;
    setSelectedDayRange: (range: DayRange) => void;
}

const formatPersianDate = (date: Day | null) => {
    if (!date) return "";
    return `${date.year}/${date.month}/${date.day}`;
}

export const PersianDatePicker = ({ selectedDayRange, setSelectedDayRange }: PersianDatePickerProps) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    const minimumDate = {
        year: parseInt(moment().add(1, 'days').format('jYYYY')),
        month: parseInt(moment().add(1, 'days').format('jMM')),
        day: parseInt(moment().add(1, 'days').format('jDD')),
    };

    const maximumDate = {
        year: parseInt(moment().add(1, 'month').format('jYYYY')),
        month: parseInt(moment().add(1, 'month').format('jMM')),
        day: parseInt(moment().add(1, 'month').format('jDD')),
    };

    const handleDateChange = (range: DayRange) => {
        setSelectedDayRange(range);
        if (range.from && range.to) {
            setIsPopoverOpen(false);
        }
    }

    return (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
                <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDayRange.from && selectedDayRange.to ? (
                        `${formatPersianDate(selectedDayRange.from)} - ${formatPersianDate(selectedDayRange.to)}`
                    ) : (
                        <span>Select a date range</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                {isClient && (
                    <DatePicker
                        value={selectedDayRange}
                        onChange={handleDateChange}
                        minimumDate={minimumDate}
                        maximumDate={maximumDate}
                        locale="fa"
                        calendarClassName="jalali"
                        shouldHighlightWeekends
                    />
                )}
            </PopoverContent>
        </Popover>
    );
};