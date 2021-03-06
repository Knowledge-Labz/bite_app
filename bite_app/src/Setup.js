import React, { useState } from 'react';
import { Box, useColorModeValue, Text, Stack, Center, Slider, SliderTrack, SliderFilledTrack, SliderThumb, IconButton } from '@chakra-ui/react';
import {useSpring, animated } from 'react-spring'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUtensils } from '@fortawesome/free-solid-svg-icons'

export default function Setup({createLocalArray, maxPriceRating, setMaxPriceRating, minUserRating, setMinUserRating, maxDistance, setMaxDistance}) {
    const [open, toggle] = useState(true)
    const props = useSpring({ transform: `perspective(600px) rotateX(${open ? 0 : 360}deg)`, config: { mass: 5, tension: 500, friction: 80 } })
      return(
          <animated.div style={props}>
          <Center py={12}>
          <Box
            role={'group'}
            p={6}
            maxW={'560px'}
            w={'560px'}
            maxH={'400px'}
            h={'420px'}
            bg={useColorModeValue('white', 'gray.800')}
            boxShadow={'2xl'}
            rounded={'lg'}
            pos={'relative'}
            zIndex={1}>
            <Stack pt={10} align={'center'}>
                <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
                    Max Distance : {maxDistance / 1000} km
                </Text>
                <Slider defaultValue={maxDistance} min={200} max={10000} step={200} onChange={(val) => setMaxDistance(val)}>
                    <SliderTrack bg="red.100">
                        <Box position="relative" right={10} />
                        <SliderFilledTrack bg="tomato" />
                    </SliderTrack>
                    <SliderThumb boxSize={5} />
                </Slider>
                <br/>
                <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
                    Max price : {maxPriceRating} / 5
                </Text>
                <Slider defaultValue={maxPriceRating} min={1} max={5} step={1} onChange={(val) => setMaxPriceRating(val)}>
                    <SliderTrack bg="red.100">
                        <Box position="relative" right={10} />
                        <SliderFilledTrack bg="tomato" />
                    </SliderTrack>
                    <SliderThumb boxSize={5} />
                </Slider>
                <br/>
                <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
                    Min Rating : {minUserRating} / 5
                </Text>
                <Slider defaultValue={minUserRating} min={1} max={5} step={1} onChange={(val) => setMinUserRating(val)}>
                    <SliderTrack bg="red.100">
                        <Box position="relative" right={10} />
                        <SliderFilledTrack bg="tomato" />
                    </SliderTrack>
                    <SliderThumb boxSize={5} />
                </Slider>
                <br/><br/>
                <IconButton className="grow shadow-2" justifySelf="center" w="5%" icon={<FontAwesomeIcon icon={faUtensils} />} onClick={() => {
                    const loading = setInterval(() => {
                        toggle(open => !open)
                    }, 600);
                    createLocalArray(loading);
                }}></IconButton>
            </Stack>
          </Box>
        </Center>
          </animated.div>
      )}