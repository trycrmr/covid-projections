import React from 'react';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { GlobalSelector } from 'components/MapSelectors/MapSelectors';
import MapIcon from 'assets/images/mapIcon';

import {
  Wrapper,
  Content,
  MapMenuItem,
  SelectorWrapper,
  MapToggle,
  MenuBarWrapper,
  MapMenuWrapper,
  MapMenuMobileWrapper,
} from './SearchHeader.style';

const SearchHeader = ({
  children,
  mobileMenuOpen,
  setMobileMenuOpen,
  mapOption,
  setMapOption,
  location,
  locationName,
  countyName = null,
  intervention,
}) => {
  const history = useHistory();
  const isMobile = useMediaQuery('(max-width:1200px)');

  const handleStateSelectChange = option => {
    const route = `/state/${option.state_code}`;

    history.push(route);

    window.scrollTo(0, 0);

    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(mobileMenuOpen = !mobileMenuOpen)
  }

  return (
    <Wrapper>
      <Content>
        <MenuBarWrapper>
          <SelectorWrapper>
            <GlobalSelector handleChange={handleStateSelectChange} />
          </SelectorWrapper>
          {isMobile &&
              <MapToggle
                onClick={() => toggleMobileMenu()}
                 isActive={mobileMenuOpen}>
              <MapIcon />
            </MapToggle>
          }
          {!isMobile &&
            <MapMenuWrapper>
              <MapMenuItem
                onClick={() => setMapOption('NATIONAL')}
                selected={mapOption === 'NATIONAL'}
              >
                United States
              </MapMenuItem>
                <MapMenuItem
                  onClick={() => setMapOption('STATE')}
                  selected={mapOption === 'STATE'}
                >
                {locationName}
              </MapMenuItem>
            </MapMenuWrapper>
          }
        </MenuBarWrapper>
        {(isMobile && mobileMenuOpen) &&
          <MapMenuMobileWrapper>
            <MapMenuItem
              onClick={() => setMapOption('NATIONAL')}
              selected={mapOption === 'NATIONAL'}
            >
              United States
            </MapMenuItem>
              <MapMenuItem
                onClick={() => setMapOption('STATE')}
                selected={mapOption === 'STATE'}
              >
              {locationName}
            </MapMenuItem>
          </MapMenuMobileWrapper>
        }
      </Content>
    </Wrapper>
  );
};

export default SearchHeader;