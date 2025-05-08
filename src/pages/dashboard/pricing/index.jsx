import React, { useState } from 'react';
import {
    Box,
    Typography,
    Slider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Container,
    Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import "./styles.css";

const marks = [
    { value: 10, label: '10' },
    { value: 1000, label: '100' },
    { value: 5000, label: '200' },
    { value: 30000, label: '300' },
    { value: 100000, label: '400' },
    { value: 100001, label: '500' },
];

const getPlan = (users) => {
    if (users <= 10) return { label: 'Free 😎', details: ['up to 10 MAU'] };
    if (users <= 1000) return { label: '$49/mo', details: ['up to 1,0 MAU'] };
    if (users <= 5000) return { label: '$99/mo', details: ['up to 5,0 MAU'] };
    if (users <= 30000) return { label: '$249/mo', details: ['up to 30,0 MAU'] };
    if (users <= 100000) return { label: '$499/mo', details: ['up to 100,0 MAU'] };
    return { label: 'Contact us', details: ['Custom pricing for 100,000+ MAU'] };
};

const PricingComponent = () => {
    const [sliderIndex, setSliderIndex] = useState(0);
    const selectedValue = marks[sliderIndex].value;
    const plan = getPlan(selectedValue);

    const handleChange = (e, newIndex) => {
        setSliderIndex(newIndex);
    };

    return (
        <Box
            sx={{
                py: 8,
                textAlign: 'center',
            }}
            className='container'
        >
            <Container maxWidth="sm">
                <Typography variant="h2" fontWeight="bold" gutterBottom>
                    Pricing
                </Typography>
                <Typography variant="h4" mb={4}>
                    Flexible plans, pay as you grow.
                </Typography>

                <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                    <Typography variant="h5" gutterBottom textAlign="left">
                        Users per month
                    </Typography>

                    <Slider
                        value={sliderIndex}
                        onChange={handleChange}
                        step={1}
                        min={0}
                        max={marks.length - 1}
                        marks={marks.map((m, i) => ({ value: i, label: m.label }))}
                        sx={{ mt: 4 }}
                        componentsProps={{
                            markLabel: {
                                style: {
                                    color: 'rgba(0, 0, 0, 0.6)',
                                },
                            },
                        }}
                    />

                    <Typography variant="h6" mt={2} color='rgba(0, 0, 0, 0.6)'>
                        {plan.label}
                    </Typography>

                    <Box mt={1} textAlign="left" pl={2}>
                        {plan.details.map((item, index) => (
                            <Typography key={index} variant="body1">• {item}</Typography>
                        ))}
                    </Box>
                </Paper>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        What are monthly active users (MAU) and how are they calculated?
                    </AccordionSummary>
                    <AccordionDetails>
                        All subscription plans are based on the amount of monthly active users your app has. Every user that opens your app and uses DeepAR features is counted as an active user for that month.
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        Can I change my subscription at any time?
                    </AccordionSummary>
                    <AccordionDetails>
                        Yes. You can upgrade, downgrade or cancel your subscription at any time. There are no refunds for the active time period for your subscription.

                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        Can I try DeepAR SDK for free?
                    </AccordionSummary>
                    <AccordionDetails>
                        Yep 😎! You can try all features for free, with up to 10 users per month.
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        How many projects does one subscription include?
                    </AccordionSummary>
                    <AccordionDetails>
                        One subscription is valid for one project which includes one iOS, one Android, one HTML5 and one macOS application. All applications contribute to the same monthly active user (MAU) count.
                    </AccordionDetails>
                </Accordion>
            </Container>
        </Box>
    );
};

export default PricingComponent;
