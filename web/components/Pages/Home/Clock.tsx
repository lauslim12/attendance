import { VStack } from '@chakra-ui/react';
import { memo, useEffect, useState } from 'react';

import MainHeading from '../../MainHeading';

/**
 * Clock component.
 *
 * @returns Clock component.
 */
const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerUpdate = setInterval(() => setTime(new Date()), 1000);

    return () => clearInterval(timerUpdate);
  }, []);

  return (
    <VStack as="section" spacing={1}>
      <MainHeading
        text={time.toLocaleDateString('en-GB')}
        as="h2"
        fontSize={['4xl', '5xl', '7xl']}
        letterSpacing={10}
      />

      <MainHeading
        text={time.toLocaleTimeString('en-GB')}
        as="h3"
        fontSize={['4xl', '4xl', '6xl']}
        letterSpacing={10}
      />
    </VStack>
  );
};

export default memo(Clock);
