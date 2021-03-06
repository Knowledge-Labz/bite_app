import React from 'react';
import { Box, Image, useColorModeValue, Text, Stack, Heading, Center, Badge } from '@chakra-ui/react';

export default function BiteCard({isRestaurant, isBar, price, rating, title, address, imageUrl, changeMeal, toggle, open}) {
      return(
          <Center py={12}>
          <Box
            role={'group'}
            p={6}
            maxW={'330px'}
            w={'full'}
            bg={useColorModeValue('white', 'gray.800')}
            boxShadow={'2xl'}
            rounded={'lg'}
            pos={'relative'}
            zIndex={1}>
            <Box
              rounded={'lg'}
              mt={-12}
              pos={'relative'}
              height={'230px'}
              _after={{
                transition: 'all .3s ease',
                content: '""',
                w: 'full',
                h: 'full',
                pos: 'absolute',
                top: 5,
                left: 0,
                filter: 'blur(15px)',
                zIndex: -1,
              }}
              _groupHover={{
                _after: {
                  filter: 'blur(20px)',
                },
              }}>
              <Image
                rounded={'lg'}
                height={230}
                width={282}
                objectFit={'cover'}
                src={imageUrl}
                onClick={() => {toggle(!open); setTimeout(() => changeMeal(), 300); setTimeout(() => toggle(open), 1000)}}
              />
            </Box>
            <Stack pt={10} align={'center'}>
              { isRestaurant ? <Badge borderRadius="full" px="2" colorScheme="orange">Restaurant</Badge> : <span/>}
              { isBar ? <Badge borderRadius="full" px="2" colorScheme="red">Bar</Badge> : <span/>}
              <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500} textAlign={'center'}>
                {title}
              </Heading>
              <Text fontWeight={200} fontSize={'s'} textAlign={'center'}>
                {address}
              </Text>
              <Stack direction={'column'} align={'center'}>
                <Text fontWeight={200} fontSize={'xl'}>
                  ???? : {price} / 5
                </Text>
                <Text fontWeight={200} fontSize={'xl'}>
                  ??? : {rating} / 5
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Center>
      )}