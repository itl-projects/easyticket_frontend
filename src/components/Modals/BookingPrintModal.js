import React from 'react';
import { useSelector } from 'react-redux';
import { sentenceCase } from 'change-case';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { format, formatISO } from 'date-fns';
import { Typography } from '@material-ui/core';
import {
  Page,
  Text,
  View,
  Image,
  Document,
  StyleSheet,
  PDFViewer,
  Font
} from '@react-pdf/renderer';
import logo from '../../assets/images/easyticketlogo.png';
import { useAdminContext } from '../../context/AdminContext';
import { getAirlineNameById, getAirportNameById } from '../../utils/helperFunctions';

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/roboto/v27/KFOkCnqEu92Fr1MmgWxPKTM1K9nz.ttf',
      fontWeight: 100
    },
    {
      src: 'https://fonts.gstatic.com/s/roboto/v27/KFOlCnqEu92Fr1MmSU5vAx05IsDqlA.ttf',
      fontWeight: 300
    },
    {
      src: 'https://fonts.gstatic.com/s/roboto/v27/KFOlCnqEu92Fr1MmEU9vAx05IsDqlA.ttf',
      fontWeight: 500
    },
    {
      src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf'
    }
  ]
});

export default function BookingPrintModal() {
  const adminContext = useAdminContext();
  const { bookingPrint, toggleShowBookingPrintModal } = adminContext;
  const { booking } = useSelector((state) => state.booking);

  if (!booking) toggleShowBookingPrintModal(false);

  return (
    <Dialog
      onClose={() => toggleShowBookingPrintModal(null)}
      aria-labelledby="customized-dialog-title"
      open={bookingPrint}
      fullScreen
    >
      <MuiDialogActions sx={{ justifyContent: 'space-between' }}>
        <Typography>Print Ticket</Typography>
        <Button color="error" variant="contained" onClick={() => toggleShowBookingPrintModal(null)}>
          close
        </Button>
      </MuiDialogActions>
      <PDFViewer showToolbar height="100%" title="booking-print">
        <Document
          author="EasyTicket"
          creator="EasyTicket"
          title={booking?.bookingRef}
          subject={booking?.bookingRef}
        >
          <Page size="A4" style={styles.page} orientation="portrait">
            <View style={styles.section1}>
              <Image style={styles.image} src={logo} />
              <Text style={styles.labelText}>Booking ID: &nbsp;{booking?.bookingRef}</Text>
              <Text style={styles.labelText}>
                Booked On:{' '}
                {format(new Date(booking?.creationDate), 'dd-MMM-yyyy HH:mm:ss', {
                  timeZone: 'Asia/Kolkata'
                })}
              </Text>
            </View>
            {/* section 2 */}
            <View style={styles.row_section}>
              <Image
                src={`/static/airways-logo/${booking?.ticket.airline}.png`}
                style={styles.airline_logo}
              />
              <View style={[styles.column, styles.column_text]}>
                <Text style={[styles.labelText, styles.bold]}>
                  {getAirlineNameById(booking.ticket.airline)}
                </Text>
                <Text style={styles.labelText}>{booking?.ticket.flightNumber}</Text>
              </View>
              <View style={[styles.column, styles.column_text, styles.border_box]}>
                <Text style={[styles.labelText, styles.light_text, { fontSize: 10 }]}>
                  AIRLINE PNR
                </Text>
                <Text style={[styles.labelText, { textTransform: 'uppercase', color: '#f4621f' }]}>
                  {booking.pnr ? booking.pnr : 'Processing...'}
                </Text>
              </View>
            </View>
            <View style={{ marginBottom: 12 }} />
            {/* section 3 */}
            <View style={styles.header_section}>
              <View style={[styles.column]}>
                <View style={[styles.header, styles.orange_header, styles.padded]}>
                  <Text style={[styles.labelText, styles.text_white]}>Onward booking Detail</Text>
                  <Text style={[styles.labelText, styles.text_white]}>
                    *Please verify booking times with the airline prior to departure
                  </Text>
                </View>
                <View style={[styles.table_row, styles.padded]}>
                  <Text style={[styles.labelText, styles.bold, { width: '20%' }]}>Flight</Text>
                  <Text style={[styles.labelText, styles.bold, { width: '30%' }]}>Departing</Text>
                  <Text style={[styles.labelText, styles.bold, { width: '30%' }]}>Arriving</Text>
                  <Text style={[styles.labelText, styles.bold, { width: '20%' }]}> </Text>
                </View>
                <View style={[styles.table_cell_row, styles.padded]}>
                  <View style={[styles.column, { width: '20%' }]}>
                    <Text style={[styles.labelText, styles.bold]}>
                      {getAirlineNameById(booking.ticket.airline)}
                    </Text>
                    <Text style={[styles.labelText, { marginTop: 4 }]}>
                      {booking.ticket.flightNumber}
                    </Text>
                  </View>
                  <View style={[styles.column, { width: '30%' }]}>
                    <Text style={[styles.labelText, styles.bold]}>
                      {getAirportNameById(booking.ticket.source)}
                    </Text>
                    <Text style={[styles.labelText, { marginTop: 4 }]}>
                      {format(new Date(booking.ticket.departureDateTime), 'dd-MM-yyyy HH:mm', {
                        timeZone: 'Asia/Kolkata'
                      })}
                    </Text>
                  </View>
                  <View style={[styles.column, { width: '30%' }]}>
                    <Text style={[styles.labelText, styles.bold]}>
                      {getAirportNameById(booking.ticket.destination)}
                    </Text>
                    <Text style={[styles.labelText, { marginTop: 4 }]}>
                      {format(new Date(booking.ticket.arrivalDateTime), 'dd-MM-yyyy HH:mm', {
                        timeZone: 'Asia/Kolkata'
                      })}
                    </Text>
                  </View>
                  <View style={[styles.column, { width: '20%' }]}>
                    <Text style={[styles.labelText]}>No Stop</Text>
                    <Text style={[styles.labelText, styles.bold, { marginTop: 4 }]}>
                      {booking.ticket.isRefundable ? 'Refundable' : 'Non-Refundable'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {/* section 4 */}
            <View style={styles.header_section}>
              <View style={[styles.column]}>
                <View style={[styles.header, styles.grey_header, styles.padded]}>
                  <Text style={[styles.labelText, styles.text_white]}>Passenger(s) Detail</Text>
                </View>
                <View style={[styles.table_row, styles.padded]}>
                  <Text style={[styles.labelText, styles.bold, { width: '30%' }]}>SI. No.</Text>
                  <Text style={[styles.labelText, styles.bold, { width: '50%' }]}>
                    Passenger(s) Name
                  </Text>
                  <Text style={[styles.labelText, styles.bold, { width: '20%' }]}>Type</Text>
                </View>
                {booking.passengers.reverse().map((pass, i) => (
                  <View style={[styles.table_cell_row, styles.padded]} key={`pdf-passenger-${i}`}>
                    <Text style={[styles.labelText, { width: '30%' }]}>{i + 1}</Text>
                    <Text style={[styles.labelText, { width: '50%' }]}>
                      {sentenceCase(pass.title)}&nbsp;{sentenceCase(pass.firstName)}&nbsp;
                      {sentenceCase(pass.lastName)}
                    </Text>
                    <Text style={[styles.labelText, { width: '20%' }]}>Adult</Text>
                  </View>
                ))}
              </View>
            </View>
            {/* section 4 Booking Inclusions */}
            <View style={styles.header_section}>
              <View style={[styles.column]}>
                <View style={[styles.header, styles.padded]}>
                  <Text style={[styles.labelText]}>Booking Inclusions</Text>
                </View>
                <View style={[styles.table_row, styles.padded]}>
                  <Text style={[styles.labelText, styles.bold, { width: '40%' }]}>Baggage</Text>
                  <Text style={[styles.labelText, styles.bold, { width: '20%' }]}>Adult</Text>
                  <Text style={[styles.labelText, styles.bold, { width: '20%' }]}>Child</Text>
                  <Text style={[styles.labelText, styles.bold, { width: '20%' }]}>Infant</Text>
                </View>
                <View style={[styles.table_cell_row, styles.padded]}>
                  <Text style={[styles.labelText, { width: '40%' }]}>Cabin Baggage</Text>
                  <Text style={[styles.labelText, { width: '20%' }]}>7 kg</Text>
                  <Text style={[styles.labelText, { width: '20%' }]}>7 kg</Text>
                  <Text style={[styles.labelText, { width: '20%' }]}>0 kg</Text>
                </View>
                <View style={[styles.table_cell_row, styles.padded]}>
                  <Text style={[styles.labelText, { width: '40%' }]}>Check-In Baggage</Text>
                  <Text style={[styles.labelText, { width: '20%' }]}>15 kg</Text>
                  <Text style={[styles.labelText, { width: '20%' }]}>15 kg</Text>
                  <Text style={[styles.labelText, { width: '20%' }]}>0 kg</Text>
                </View>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.column_center}>
                <Text style={[styles.bold, styles.notice_text, { textTransform: 'uppercase' }]}>
                  Important Information
                </Text>
              </View>
              <Text style={styles.notice_line_text}>
                1. This ticket is Non Refundable & Non Changeable.
              </Text>
              <Text style={styles.notice_line_text}>
                2. All Guests, including children and infants, must present valid identification at
                check-in.
              </Text>
              <Text style={styles.notice_line_text}>
                3. As per government directives, Web Check-in is mandatory for all passengers before
                the scheduled departure of their domestic booking. Charges apply*
              </Text>
              <Text style={styles.notice_line_text}>
                4. Check-in begins 3 hours prior to the booking for seat assignment and closes 45
                minutes prior to the scheduled departure.
              </Text>
              <Text style={styles.notice_line_text}>
                5. Charged fare is totally agreed between "BUYER & SELLER", any issues related to
                fares thereafter will not be entertained.
              </Text>
              <Text style={styles.notice_line_text}>
                6. We are not responsible for any booking delay/Cancellation from airline's end.
                kindly contact the airline at least 24 hrs before to reconfirm your booking detail
                giving reference of Airline PNR Number. For any schedule change, booking cancelled &
                terminal related issues.
              </Text>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </Dialog>
  );
}

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    flexDirection: 'column',
    // backgroundColor: '#E4E4E4',
    width: '100%',
    padding: 20
  },
  column: {
    display: 'flex',
    flexDirection: 'column'
  },
  column_center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  column_text: {
    alignItems: 'center'
  },
  table_row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#DFE3E8'
  },
  table_cell_row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e4',
    alignItems: 'center'
  },
  padded: {
    paddingHorizontal: 12,
    paddingVertical: 5
  },
  section1: {
    width: '100%',
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    borderColor: '#e4e4e4',
    borderWidth: 1,
    paddingRight: 12,
    paddingBottom: 5
  },
  header_section: {
    display: 'flex',
    flexDirection: 'column',
    borderColor: '#e4e4e4',
    borderWidth: 1,
    marginVertical: 5
  },
  row_section: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#e4e4e4',
    borderWidth: 1,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 5
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  orange_header: {
    backgroundColor: '#f4621f'
  },
  border_box: {
    borderWidth: 1.5,
    borderColor: '#f4621f',
    paddingHorizontal: 18,
    paddingVertical: 8
  },
  image: {
    marginVertical: 5,
    height: '22px',
    width: '94px'
  },
  airline_logo: {
    width: '72px',
    height: '72px'
  },
  labelText: {
    fontSize: 11,
    marginBottom: 2,
    color: '#000000aa'
  },
  notice_text: {
    fontSize: 16,
    marginBottom: 25,
    marginTop: 20
  },
  notice_line_text: {
    fontSize: 11,
    marginBottom: 6,
    fontWeight: 300
  },
  bold: {
    fontWeight: 500
  },
  light_text: {
    fontWeight: 100,
    color: '#000000'
  },
  text_white: {
    color: '#ffffff'
  },
  grey_header: {
    backgroundColor: 'grey'
  }
});
