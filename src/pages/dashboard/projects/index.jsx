import { useState, useEffect } from 'react';
import { Typography } from "@mui/material";
import BarChart from "./BarChart";
import { database } from '../../../config/firebaseConfig';
import { onValue, ref } from 'firebase/database';

const Projects = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const pregomeshRef = ref(database, 'pregomesh');

    const unsubscribe = onValue(pregomeshRef, (snapshot) => {
      const data = snapshot.val() || {};
      setChartData(data);
      // Optional: implement or remove these if not needed
      // createCheckboxes(['All', ...Object.keys(data)]);
      // updateChart();
    });

    // Optional cleanup (though not needed with `onValue`, unlike `onSnapshot`)
    return () => unsubscribe();
  }, []);

  console.log(chartData)

  return (
    <Typography paragraph>
      <BarChart chartData={chartData} />
    </Typography>
  );
};

export default Projects;
