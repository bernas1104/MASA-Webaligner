import React from 'react';
import { MdMail, MdLocationOn, MdCall } from 'react-icons/md';
import { FaTwitter, FaFacebookF } from 'react-icons/fa';

import {
  CoverImg,
  Container,
  MASAProject,
  CardsContainer,
  Card,
  AboutUs,
  AboutUsContainer,
  Footer,
  ContactUs,
  ContactContainer,
  ContactInfo,
  ContactForm,
  Divider,
  FooterContainer,
} from './styles';

import Header from '../../components/Header';

const Home: React.FC = () => {
  return (
    <>
      <Header />

      <CoverImg>
        <img src="https://via.placeholder.com/1920x1080" alt="" />
      </CoverImg>

      <Container>
        <MASAProject>
          <h2>MASA Project</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut
            erat accumsan, tempus neque rutrum, venenatis tellus. Suspendisse
            dui metus, efficitur ac felis quis, vestibulum fermentum lectus.
          </p>

          <CardsContainer>
            <Card>
              <img src="https://via.placeholder.com/100" alt="" />
              <h3>Lorem Ipsum</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut
                erat accumsan, tempus neque rutrum, venenatis tellus.
              </p>
            </Card>

            <Card>
              <img src="https://via.placeholder.com/100" alt="" />
              <h3>Lorem Ipsum</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut
                erat accumsan, tempus neque rutrum, venenatis tellus.
              </p>
            </Card>

            <Card>
              <img src="https://via.placeholder.com/100" alt="" />
              <h3>Lorem Ipsum</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut
                erat accumsan, tempus neque rutrum, venenatis tellus.
              </p>
            </Card>
          </CardsContainer>
        </MASAProject>

        <AboutUs>
          <h2>About Us</h2>

          <AboutUsContainer>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut
              erat accumsan, tempus neque rutrum, venenatis tellus. Suspendisse
              dui metus, efficitur ac felis quis, vestibulum fermentum lectus.
              Nullam imperdiet velit quis odio commodo bibendum. Praesent
              sagittis magna ut metus efficitur, a vehicula nibh sollicitudin.
              Nulla urna tellus, semper in massa quis, mattis feugiat quam.
              Nulla a cursus magna. Sed rutrum commodo tellus, id tincidunt
              nulla interdum ac. Nunc ut lacus elit. Aenean orci dui, finibus eu
              magna non, dignissim sodales tellus. Fusce eleifend risus vitae
              aliquet mattis. Mauris at nulla at enim ornare condimentum a quis
              turpis. Phasellus posuere urna non tortor iaculis egestas. Etiam
              vitae ante fermentum, maximus lacus ut, ultricies nunc. Proin sit
              amet nunc sit amet sem rutrum facilisis. In varius metus ut nulla
              iaculis luctus. Sed ut porttitor lacus.
            </p>
            <img src="https://via.placeholder.com/625x400" alt="" />
          </AboutUsContainer>
        </AboutUs>
      </Container>

      <Footer>
        <ContactUs>
          <h2>Contact Us</h2>

          <ContactContainer>
            <ContactInfo className="contact-info">
              <div>
                <div>
                  <h3>EMAIL</h3>
                  <div>
                    <MdMail size={20} />
                    <a href="mailto:contact@unb.br">contact@unb.br</a>
                  </div>
                </div>

                <div>
                  <h3>ADDRESS</h3>
                  <div className="address">
                    <MdLocationOn size={20} />
                    <pre>
                      Universidade de Brasília
                      <br />
                      CIC/EST Building, Campus Darcy Ribeiro
                      <br />
                      Asa Norte, Brasília - DF
                      <br />
                      70910-900
                    </pre>
                  </div>
                </div>
              </div>

              <div>
                <div>
                  <h3>PHONE</h3>
                  <div>
                    <MdCall size={20} />
                    <p>+55 61 9999 9999</p>
                  </div>
                </div>

                <div>
                  <h3>SOCIAL</h3>
                  <ul>
                    <li>
                      <a href="l">
                        <FaFacebookF size={20} color="#f5f5f5" />
                        MASA Project
                      </a>
                    </li>
                    <li>
                      <a href="l">
                        <FaTwitter size={20} color="#f5f5f5" />
                        @MASAProject
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </ContactInfo>

            <Divider />

            <ContactForm
              onSubmit={(e) => e.preventDefault()}
              className="contact-form"
            >
              <input type="text" placeholder="Your name" />
              <input type="text" placeholder="Your e-mail" />
              <textarea
                name="message"
                cols={30}
                rows={5}
                placeholder="Your message"
              />
              <input type="submit" value="SEND" />
            </ContactForm>
          </ContactContainer>
        </ContactUs>

        <FooterContainer>
          <p>
            Desenvolvimento por&nbsp;
            <a
              href="https://github.com/bernas1104"
              target="_blank"
              rel="noopener noreferrer"
            >
              Bernardo Costa Nascimento
            </a>
          </p>
        </FooterContainer>
      </Footer>
    </>
  );
};

export default Home;
