import { observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

export const Footer = observer(() =>
	<BlueFooter>
		<Wrapper>Made with ❤️ by <Link href='https://blumenkraft.company/' target='_blank' rel='noreferrer'>Blumenkraft Company</Link></Wrapper>
	</BlueFooter>);

const BlueFooter = styled.footer`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #213c5e;
  color: white;
  text-align: center;
  z-index: 10000;
`;

const Link = styled.a`
	color: white;
`;

const Wrapper = styled.div`
	padding-top: 5px;
	padding-bottom: 5px;
	float: right;
	margin-right: 10px;
`;
