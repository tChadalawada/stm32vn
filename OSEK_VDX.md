# OSEK/VDX ON EASY\_STM32 #

> https://stm32vn.googlecode.com/svn/trunk/Image/EASY_STM32_REVB.JPG

# OIL Config #

```

    CPU mySystem {

	OS myOs {
		EE_OPT = "DEBUG";
		//EE_OPT = "__KEIL_4_54_OLDER__";
		//EE_OPT = "__KEIL_USE_AXF_EXT__";
		//LDFLAGS =" --specs=rdimon.specs -lrdimon";
		EE_OPT = "__NO_APP__";
		
		CPU_DATA = CORTEX_MX {
		   MODEL = M4;
		   APP_SRC = "code.c";
		   COMPILER_TYPE = KEIL; 
		   //COMPILER_TYPE = GNU;
		   MULTI_STACK = TRUE { 
                      IRQ_STACK = TRUE { 
                         SYS_SIZE = 2048; 
                      };                        
                   };
		};
		
		EE_OPT = "__USE_SYSTICK__";

		MCU_DATA = STM32 {
			MODEL = STM32F4xx;
		};

		KERNEL_TYPE = ECC2;

                /* Pre-AUTOSAR Conformance StartOS()  */
    	        EE_OPT = "__OO_STARTOS_OLD__";	
    		
    	        STATUS = EXTENDED;
    	        STARTUPHOOK = TRUE;		
    	        ERRORHOOK = TRUE;
    	        SHUTDOWNHOOK = FALSE;
    	        PRETASKHOOK = FALSE;
    	        POSTTASKHOOK = FALSE;
    	        USEGETSERVICEID = FALSE;
    	        USEPARAMETERACCESS = FALSE;
    	        USERESSCHEDULER = TRUE;		
		
		
		EE_OPT = "__ADD_LIBS__";
		
		LIB = ENABLE { NAME = "ST_CMSIS"; };
		
		LIB = ENABLE { NAME = "STM32F4XX_SPD"; };
		
		LIB = ENABLE {
			NAME = "STM32F4_DISCOVERY";
			STM32F4_DISCOVERY = ENABLE {
				USECOM = TRUE;
			};			
		};

	      };

  	        ISR systick_handler {
    	           CATEGORY = 2;
    	           ENTRY = "SYSTICK";
    	           PRIORITY = 1;
  	        };		
	
                COUNTER Counter1 {
                   MINCYCLE = 2;
                   MAXALLOWEDVALUE = 0xFFFF ;
                   TICKSPERBASE = 1;
                };
    
                TASK Task1 {
		   PRIORITY = 0x01;
		   ACTIVATION = 1;
		   SCHEDULE = FULL;
		   AUTOSTART = TRUE;
		   STACK = PRIVATE { SYS_SIZE = 1024; };
		   EVENT = Evt_Alarm;		
                };

                ALARM Alarm {
                   COUNTER = Counter1;
                   ACTION = SETEVENT { TASK = Task1; EVENT = Evt_Alarm; };
                   AUTOSTART = FALSE;
                };

                EVENT Evt_Alarm { MASK = AUTO; };
    
        };

```

# Task Function #

```

     /*
      * Task1 
      */
     TASK(Task1)
     {
        EventMaskType mask;
  
	static int t = 0;
	
        while (1)
        {
	   WaitEvent(Evt_Alarm);
	   GetEvent(Task1, &mask);

	   if (mask & Evt_Alarm)
	   {
	      ClearEvent(Evt_Alarm);
			
	      printf("Task1 - Alarm ");
			
	      if (t == 0) printf("|");
	      if (t == 1) printf("/");
	      if (t == 2) printf("-");			
	      if (t == 3) printf("\\");				
	      (t == 3) ? t = 0 : t++;
	      printf("\r");
	   }  
        }
     }
```

# Debug with KEIL IDE #

> ![http://stm32vn.googlecode.com/svn/trunk/Image/OSEK_VDX_DEMO.png](http://stm32vn.googlecode.com/svn/trunk/Image/OSEK_VDX_DEMO.png)

# Source Code #

> [osek\_keil\_04.rar](http://armtutorial.googlecode.com/svn/trunk/src/osek_keil_04.rar)