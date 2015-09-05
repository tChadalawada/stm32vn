# usbh\_core.h #

```
/**
  ******************************************************************************
  * @file    usbh_core.h
  * @author  MCD Application Team
  * @version V2.0.0
  * @date    22-July-2011
  * @brief   Header file for usbh_core.c
  ******************************************************************************
  * @attention
  *
  * THE PRESENT FIRMWARE WHICH IS FOR GUIDANCE ONLY AIMS AT PROVIDING CUSTOMERS
  * WITH CODING INFORMATION REGARDING THEIR PRODUCTS IN ORDER FOR THEM TO SAVE
  * TIME. AS A RESULT, STMICROELECTRONICS SHALL NOT BE HELD LIABLE FOR ANY
  * DIRECT, INDIRECT OR CONSEQUENTIAL DAMAGES WITH RESPECT TO ANY CLAIMS ARISING
  * FROM THE CONTENT OF SUCH FIRMWARE AND/OR THE USE MADE BY CUSTOMERS OF THE
  * CODING INFORMATION CONTAINED HEREIN IN CONNECTION WITH THEIR PRODUCTS.
  *
  * <h2><center>&copy; COPYRIGHT 2011 STMicroelectronics</center></h2>
  ******************************************************************************
  */ 

/* Define to prevent recursive  ----------------------------------------------*/
#ifndef __USBH_CORE_H
#define __USBH_CORE_H

/* Includes ------------------------------------------------------------------*/
#include "usb_hcd.h"
#include "usbh_def.h"
#include "usbh_conf.h"

/** @addtogroup USBH_LIB
  * @{
  */

/** @addtogroup USBH_LIB_CORE
* @{
*/
  
/** @defgroup USBH_CORE
  * @brief This file is the Header file for usbh_core.c
  * @{
  */ 


/** @defgroup USBH_CORE_Exported_Defines
  * @{
  */ 

#define MSC_CLASS                         0x08
#define HID_CLASS                         0x03
#define MSC_PROTOCOL                      0x50
#define CBI_PROTOCOL                      0x01


#define USBH_MAX_ERROR_COUNT                            2
#define USBH_DEVICE_ADDRESS_DEFAULT                     0
#define USBH_DEVICE_ADDRESS                             1


/**
  * @}
  */ 


/** @defgroup USBH_CORE_Exported_Types
  * @{
  */

typedef enum {
  USBH_OK   = 0,
  USBH_BUSY,
  USBH_FAIL,
  USBH_NOT_SUPPORTED,
  USBH_UNRECOVERED_ERROR,
  USBH_ERROR_SPEED_UNKNOWN,
  USBH_APPLY_DEINIT
}USBH_Status;

/* Following states are used for gState */
typedef enum {
  HOST_IDLE =0,
  HOST_ISSUE_CORE_RESET,
  HOST_DEV_ATTACHED,
  HOST_DEV_DISCONNECTED,  
  HOST_ISSUE_RESET,
  HOST_DETECT_DEVICE_SPEED,
  HOST_ENUMERATION,
  HOST_CLASS_REQUEST,  
  HOST_CLASS,
  HOST_CTRL_XFER,
  HOST_USR_INPUT,
  HOST_SUSPENDED,
  HOST_ERROR_STATE  
}HOST_State;  

/* Following states are used for EnumerationState */
typedef enum {
  ENUM_IDLE = 0,
  ENUM_GET_FULL_DEV_DESC,
  ENUM_SET_ADDR,
  ENUM_GET_CFG_DESC,
  ENUM_GET_FULL_CFG_DESC,
  ENUM_GET_MFC_STRING_DESC,
  ENUM_GET_PRODUCT_STRING_DESC,
  ENUM_GET_SERIALNUM_STRING_DESC,
  ENUM_SET_CONFIGURATION,
  ENUM_DEV_CONFIGURED
} ENUM_State;  



/* Following states are used for CtrlXferStateMachine */
typedef enum {
  CTRL_IDLE =0,
  CTRL_SETUP,
  CTRL_SETUP_WAIT,
  CTRL_DATA_IN,
  CTRL_DATA_IN_WAIT,
  CTRL_DATA_OUT,
  CTRL_DATA_OUT_WAIT,
  CTRL_STATUS_IN,
  CTRL_STATUS_IN_WAIT,
  CTRL_STATUS_OUT,
  CTRL_STATUS_OUT_WAIT,
  CTRL_ERROR
}
CTRL_State;  

typedef enum {
  USBH_USR_NO_RESP   = 0,
  USBH_USR_RESP_OK = 1,
}
USBH_USR_Status;

/* Following states are used for RequestState */
typedef enum {
  CMD_IDLE =0,
  CMD_SEND,
  CMD_WAIT
} CMD_State;  



typedef struct _Ctrl
{
  uint8_t               hc_num_in; 
  uint8_t               hc_num_out; 
  uint8_t               ep0size;  
  uint8_t               *buff;
  uint16_t              length;
  uint8_t               errorcount;
  uint16_t              timer;  
  CTRL_STATUS           status;
  USB_Setup_TypeDef     setup;
  CTRL_State            state;  

} USBH_Ctrl_TypeDef;



typedef struct _DeviceProp
{
  
  uint8_t                           address;
  uint8_t                           speed;
  USBH_DevDesc_TypeDef              Dev_Desc;
  USBH_CfgDesc_TypeDef              Cfg_Desc;  
  USBH_InterfaceDesc_TypeDef        Itf_Desc[USBH_MAX_NUM_INTERFACES];
  USBH_EpDesc_TypeDef               Ep_Desc[USBH_MAX_NUM_INTERFACES][USBH_MAX_NUM_ENDPOINTS];
  USBH_HIDDesc_TypeDef              HID_Desc;
  
}USBH_Device_TypeDef;

typedef struct _USBH_Class_cb
{
  USBH_Status  (*Init)\
    (USB_OTG_CORE_HANDLE *pdev , void *phost);
  void         (*DeInit)\
    (USB_OTG_CORE_HANDLE *pdev , void *phost);
  USBH_Status  (*Requests)\
    (USB_OTG_CORE_HANDLE *pdev , void *phost);  
  USBH_Status  (*Machine)\
    (USB_OTG_CORE_HANDLE *pdev , void *phost);     
  
} USBH_Class_cb_TypeDef;


typedef struct _USBH_USR_PROP
{
  void (*Init)(void);       /* HostLibInitialized */
  void (*DeInit)(void);       /* HostLibInitialized */  
  void (*DeviceAttached)(void);           /* DeviceAttached */
  void (*ResetDevice)(void);
  void (*DeviceDisconnected)(void); 
  void (*OverCurrentDetected)(void);  
  void (*DeviceSpeedDetected)(uint8_t DeviceSpeed);          /* DeviceSpeed */
  void (*DeviceDescAvailable)(void *);    /* DeviceDescriptor is available */
  void (*DeviceAddressAssigned)(void);  /* Address is assigned to USB Device */
  void (*ConfigurationDescAvailable)(USBH_CfgDesc_TypeDef *,
                                     USBH_InterfaceDesc_TypeDef *,
                                     USBH_EpDesc_TypeDef *); 
  /* Configuration Descriptor available */
  void (*ManufacturerString)(void *);     /* ManufacturerString*/
  void (*ProductString)(void *);          /* ProductString*/
  void (*SerialNumString)(void *);        /* SerialNubString*/
  void (*EnumerationDone)(void);           /* Enumeration finished */
  USBH_USR_Status (*UserInput)(void);
  int (*USBH_USR_MSC_Application) (void);
  void (*USBH_USR_DeviceNotSupported)(void); /* Device is not supported*/
  void (*UnrecoveredError)(void);

}
USBH_Usr_cb_TypeDef;

typedef struct _Host_TypeDef
{
  HOST_State            gState;       /*  Host State Machine Value */
  HOST_State            gStateBkp;    /* backup of previous State machine value */
  ENUM_State            EnumState;    /* Enumeration state Machine */
  CMD_State             RequestState;       
  USBH_Ctrl_TypeDef     Control;
  
  USBH_Device_TypeDef   device_prop; 
  
  USBH_Class_cb_TypeDef               *class_cb;  
  USBH_Usr_cb_TypeDef  	              *usr_cb;

  
} USBH_HOST, *pUSBH_HOST;

/**
  * @}
  */ 



/** @defgroup USBH_CORE_Exported_Macros
  * @{
  */ 

/**
  * @}
  */ 

/** @defgroup USBH_CORE_Exported_Variables
  * @{
  */ 

/**
  * @}
  */ 

/** @defgroup USBH_CORE_Exported_FunctionsPrototype
  * @{
  */ 
void USBH_Init(USB_OTG_CORE_HANDLE *pdev,
               USB_OTG_CORE_ID_TypeDef coreID, 
               USBH_HOST *phost,                    
               USBH_Class_cb_TypeDef *class_cb, 
               USBH_Usr_cb_TypeDef *usr_cb);
               
USBH_Status USBH_DeInit(USB_OTG_CORE_HANDLE *pdev, 
                        USBH_HOST *phost);
void USBH_Process(USB_OTG_CORE_HANDLE *pdev , 
                  USBH_HOST *phost);
void USBH_ErrorHandle(USBH_HOST *phost, 
                      USBH_Status errType);

/**
  * @}
  */ 

#endif /* __USBH_CORE_H */
/**
  * @}
  */ 

/**
  * @}
  */ 

/**
* @}
*/ 

/******************* (C) COPYRIGHT 2011 STMicroelectronics *****END OF FILE****/
```


---


# usbh\_def.h #

```
/**
  ******************************************************************************
  * @file    usbh_def.h
  * @author  MCD Application Team
  * @version V2.0.0
  * @date    22-July-2011
  * @brief   Definitions used in the USB host library
  ******************************************************************************
  * @attention
  *
  * THE PRESENT FIRMWARE WHICH IS FOR GUIDANCE ONLY AIMS AT PROVIDING CUSTOMERS
  * WITH CODING INFORMATION REGARDING THEIR PRODUCTS IN ORDER FOR THEM TO SAVE
  * TIME. AS A RESULT, STMICROELECTRONICS SHALL NOT BE HELD LIABLE FOR ANY
  * DIRECT, INDIRECT OR CONSEQUENTIAL DAMAGES WITH RESPECT TO ANY CLAIMS ARISING
  * FROM THE CONTENT OF SUCH FIRMWARE AND/OR THE USE MADE BY CUSTOMERS OF THE
  * CODING INFORMATION CONTAINED HEREIN IN CONNECTION WITH THEIR PRODUCTS.
  *
  * <h2><center>&copy; COPYRIGHT 2011 STMicroelectronics</center></h2>
  ******************************************************************************
  */ 
/** @addtogroup USBH_LIB
  * @{
  */

/** @addtogroup USBH_LIB_CORE
* @{
*/
  
/** @defgroup USBH_DEF
  * @brief This file is includes USB descriptors
  * @{
  */ 

#ifndef  USBH_DEF_H
#define  USBH_DEF_H

#ifndef USBH_NULL
#define USBH_NULL ((void *)0)
#endif

#ifndef FALSE
#define FALSE 0
#endif

#ifndef TRUE
#define TRUE 1
#endif


#define ValBit(VAR,POS)                               (VAR & (1 << POS))
#define SetBit(VAR,POS)                               (VAR |= (1 << POS))
#define ClrBit(VAR,POS)                               (VAR &= ((1 << POS)^255))

#define  LE16(addr)             (((u16)(*((u8 *)(addr))))\
                                + (((u16)(*(((u8 *)(addr)) + 1))) << 8))

#define  USB_LEN_DESC_HDR                               0x02
#define  USB_LEN_DEV_DESC                               0x12
#define  USB_LEN_CFG_DESC                               0x09
#define  USB_LEN_IF_DESC                                0x09
#define  USB_LEN_EP_DESC                                0x07
#define  USB_LEN_OTG_DESC                               0x03
#define  USB_LEN_SETUP_PKT                              0x08

/* bmRequestType :D7 Data Phase Transfer Direction  */
#define  USB_REQ_DIR_MASK                               0x80
#define  USB_H2D                                        0x00
#define  USB_D2H                                        0x80

/* bmRequestType D6..5 Type */
#define  USB_REQ_TYPE_STANDARD                          0x00
#define  USB_REQ_TYPE_CLASS                             0x20
#define  USB_REQ_TYPE_VENDOR                            0x40
#define  USB_REQ_TYPE_RESERVED                          0x60

/* bmRequestType D4..0 Recipient */
#define  USB_REQ_RECIPIENT_DEVICE                       0x00
#define  USB_REQ_RECIPIENT_INTERFACE                    0x01
#define  USB_REQ_RECIPIENT_ENDPOINT                     0x02
#define  USB_REQ_RECIPIENT_OTHER                        0x03

/* Table 9-4. Standard Request Codes  */
/* bRequest , Value */
#define  USB_REQ_GET_STATUS                             0x00
#define  USB_REQ_CLEAR_FEATURE                          0x01
#define  USB_REQ_SET_FEATURE                            0x03
#define  USB_REQ_SET_ADDRESS                            0x05
#define  USB_REQ_GET_DESCRIPTOR                         0x06
#define  USB_REQ_SET_DESCRIPTOR                         0x07
#define  USB_REQ_GET_CONFIGURATION                      0x08
#define  USB_REQ_SET_CONFIGURATION                      0x09
#define  USB_REQ_GET_INTERFACE                          0x0A
#define  USB_REQ_SET_INTERFACE                          0x0B
#define  USB_REQ_SYNCH_FRAME                            0x0C

/* Table 9-5. Descriptor Types of USB Specifications */
#define  USB_DESC_TYPE_DEVICE                              1
#define  USB_DESC_TYPE_CONFIGURATION                       2
#define  USB_DESC_TYPE_STRING                              3
#define  USB_DESC_TYPE_INTERFACE                           4
#define  USB_DESC_TYPE_ENDPOINT                            5
#define  USB_DESC_TYPE_DEVICE_QUALIFIER                    6
#define  USB_DESC_TYPE_OTHER_SPEED_CONFIGURATION           7
#define  USB_DESC_TYPE_INTERFACE_POWER                     8
#define  USB_DESC_TYPE_HID                                 0x21
#define  USB_DESC_TYPE_HID_REPORT                          0x22


#define USB_DEVICE_DESC_SIZE                               18
#define USB_CONFIGURATION_DESC_SIZE                        9
#define USB_HID_DESC_SIZE                                  9
#define USB_INTERFACE_DESC_SIZE                            9
#define USB_ENDPOINT_DESC_SIZE                             7

/* Descriptor Type and Descriptor Index  */
/* Use the following values when calling the function USBH_GetDescriptor  */
#define  USB_DESC_DEVICE                    ((USB_DESC_TYPE_DEVICE << 8) & 0xFF00)
#define  USB_DESC_CONFIGURATION             ((USB_DESC_TYPE_CONFIGURATION << 8) & 0xFF00)
#define  USB_DESC_STRING                    ((USB_DESC_TYPE_STRING << 8) & 0xFF00)
#define  USB_DESC_INTERFACE                 ((USB_DESC_TYPE_INTERFACE << 8) & 0xFF00)
#define  USB_DESC_ENDPOINT                  ((USB_DESC_TYPE_INTERFACE << 8) & 0xFF00)
#define  USB_DESC_DEVICE_QUALIFIER          ((USB_DESC_TYPE_DEVICE_QUALIFIER << 8) & 0xFF00)
#define  USB_DESC_OTHER_SPEED_CONFIGURATION ((USB_DESC_TYPE_OTHER_SPEED_CONFIGURATION << 8) & 0xFF00)
#define  USB_DESC_INTERFACE_POWER           ((USB_DESC_TYPE_INTERFACE_POWER << 8) & 0xFF00)
#define  USB_DESC_HID_REPORT                ((USB_DESC_TYPE_HID_REPORT << 8) & 0xFF00)
#define  USB_DESC_HID                       ((USB_DESC_TYPE_HID << 8) & 0xFF00)


#define  USB_EP_TYPE_CTRL                               0x00
#define  USB_EP_TYPE_ISOC                               0x01
#define  USB_EP_TYPE_BULK                               0x02
#define  USB_EP_TYPE_INTR                               0x03

#define  USB_EP_DIR_OUT                                 0x00
#define  USB_EP_DIR_IN                                  0x80
#define  USB_EP_DIR_MSK                                 0x80  

/* supported classes */
#define USB_MSC_CLASS                                   0x08
#define USB_HID_CLASS                                   0x03

/* Interface Descriptor field values for HID Boot Protocol */
#define HID_BOOT_CODE                                  0x01    
#define HID_KEYBRD_BOOT_CODE                           0x01
#define HID_MOUSE_BOOT_CODE                            0x02

/* As per USB specs 9.2.6.4 :Standard request with data request timeout: 5sec
   Standard request with no data stage timeout : 50ms */
#define DATA_STAGE_TIMEOUT                              5000 
#define NODATA_STAGE_TIMEOUT                            50

/**
  * @}
  */ 


#define USBH_CONFIGURATION_DESCRIPTOR_SIZE (USB_CONFIGURATION_DESC_SIZE \
                                           + USB_INTERFACE_DESC_SIZE\
                                           + (USBH_MAX_NUM_ENDPOINTS * USB_ENDPOINT_DESC_SIZE))


#define CONFIG_DESC_wTOTAL_LENGTH (ConfigurationDescriptorData.ConfigDescfield.\
                                          ConfigurationDescriptor.wTotalLength)


/*  This Union is copied from usb_core.h  */
typedef union
{
  uint16_t w;
  struct BW
  {
    uint8_t msb;
    uint8_t lsb;
  }
  bw;
}
uint16_t_uint8_t;


typedef union _USB_Setup
{
  uint8_t d8[8];
  
  struct _SetupPkt_Struc
  {
    uint8_t           bmRequestType;
    uint8_t           bRequest;
    uint16_t_uint8_t  wValue;
    uint16_t_uint8_t  wIndex;
    uint16_t_uint8_t  wLength;
  } b;
} 
USB_Setup_TypeDef;  

typedef  struct  _DescHeader 
{
    uint8_t  bLength;       
    uint8_t  bDescriptorType;
} 
USBH_DescHeader_t;

typedef struct _DeviceDescriptor
{
  uint8_t   bLength;
  uint8_t   bDescriptorType;
  uint16_t  bcdUSB;        /* USB Specification Number which device complies too */
  uint8_t   bDeviceClass;
  uint8_t   bDeviceSubClass; 
  uint8_t   bDeviceProtocol;
  /* If equal to Zero, each interface specifies its own class
  code if equal to 0xFF, the class code is vendor specified.
  Otherwise field is valid Class Code.*/
  uint8_t   bMaxPacketSize;
  uint16_t  idVendor;      /* Vendor ID (Assigned by USB Org) */
  uint16_t  idProduct;     /* Product ID (Assigned by Manufacturer) */
  uint16_t  bcdDevice;     /* Device Release Number */
  uint8_t   iManufacturer;  /* Index of Manufacturer String Descriptor */
  uint8_t   iProduct;       /* Index of Product String Descriptor */
  uint8_t   iSerialNumber;  /* Index of Serial Number String Descriptor */
  uint8_t   bNumConfigurations; /* Number of Possible Configurations */
}
USBH_DevDesc_TypeDef;


typedef struct _ConfigurationDescriptor
{
  uint8_t   bLength;
  uint8_t   bDescriptorType;
  uint16_t  wTotalLength;        /* Total Length of Data Returned */
  uint8_t   bNumInterfaces;       /* Number of Interfaces */
  uint8_t   bConfigurationValue;  /* Value to use as an argument to select this configuration*/
  uint8_t   iConfiguration;       /*Index of String Descriptor Describing this configuration */
  uint8_t   bmAttributes;         /* D7 Bus Powered , D6 Self Powered, D5 Remote Wakeup , D4..0 Reserved (0)*/
  uint8_t   bMaxPower;            /*Maximum Power Consumption */
}
USBH_CfgDesc_TypeDef;


typedef struct _HIDDescriptor
{
  uint8_t   bLength;
  uint8_t   bDescriptorType;
  uint16_t  bcdHID;               /* indicates what endpoint this descriptor is describing */
  uint8_t   bCountryCode;        /* specifies the transfer type. */
  uint8_t   bNumDescriptors;     /* specifies the transfer type. */
  uint8_t   bReportDescriptorType;    /* Maximum Packet Size this endpoint is capable of sending or receiving */  
  uint16_t  wItemLength;          /* is used to specify the polling interval of certain transfers. */
}
USBH_HIDDesc_TypeDef;


typedef struct _InterfaceDescriptor
{
  uint8_t bLength;
  uint8_t bDescriptorType;
  uint8_t bInterfaceNumber;
  uint8_t bAlternateSetting;    /* Value used to select alternative setting */
  uint8_t bNumEndpoints;        /* Number of Endpoints used for this interface */
  uint8_t bInterfaceClass;      /* Class Code (Assigned by USB Org) */
  uint8_t bInterfaceSubClass;   /* Subclass Code (Assigned by USB Org) */
  uint8_t bInterfaceProtocol;   /* Protocol Code */
  uint8_t iInterface;           /* Index of String Descriptor Describing this interface */
  
}
USBH_InterfaceDesc_TypeDef;


typedef struct _EndpointDescriptor
{
  uint8_t   bLength;
  uint8_t   bDescriptorType;
  uint8_t   bEndpointAddress;   /* indicates what endpoint this descriptor is describing */
  uint8_t   bmAttributes;       /* specifies the transfer type. */
  uint16_t  wMaxPacketSize;    /* Maximum Packet Size this endpoint is capable of sending or receiving */  
  uint8_t   bInterval;          /* is used to specify the polling interval of certain transfers. */
}
USBH_EpDesc_TypeDef;
#endif
/******************* (C) COPYRIGHT 2011 STMicroelectronics *****END OF FILE****/


```