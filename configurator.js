// *** Model

const TEMPLATE_PRE = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n<dict>\n	<key>StreamByter-Rules</key>\n	<string>\nif load \n  Alias 0 TRUE\n  Alias 1 FALSE\n  Alias 0 OFF\n  Alias 1 ON\n  Alias L1 chanCom \n  Alias L2 isXKey \n  Alias L3 togCount \n  Alias L4 tLen \n  Alias L5 tLoop \n  Alias L6 tbId \n  Alias L7 curBank \n  Alias L8 vType \n  Alias L9 vCC \n  Alias LA vStat \n  Alias LB vOthStat \n  Alias LC vVal \n  Alias LD vGrp \n  Alias LE vRef \n  Alias LF vOthRef \n  Alias L10 vChan \n  Alias 19 s0 \n  Alias 1A s1 \n  Alias 1B s2 \n  Alias 1C s3 \n  Alias 1D s4 \n  Alias 1E s5 \n  Alias 1F s6 \n  Alias 20 s7 \n  Alias 21 bg0 \n  Alias 2A bg1 \n  Alias 33 bg2 \n  Alias 3C bg3 \n  Alias 45 bg4 \n  Alias 4E bg5 \n  Alias 57 bg6 \n  Alias 60 bg7 \n  Alias 1 bankLeft\n  Alias 2 bankRight\n  Alias 0 tb \n  Alias 1 bt \n  Alias 2 ta \n  Alias 3 sb \n  Alias 19 bankLeftBtn\n  Alias 1A bankRightBtn\n  Alias 1B soloBtn\n  Alias 1 BtnType \n  Alias 19 BtnRef \n  Alias 31 BtnSndVal \n  Alias 49 BtnGroup \n  Alias 1 DataCC \n  Alias 31 DataStat \n  Alias 61 DataChan \n  Alias 61 Ctrls \n  Alias 79 CtrlSld \n  Alias 82 CtrlChans \n  Alias 9A CtrlSldChans \n  Define NoteOn MT == 90\n  Define NoteOff MT == 80\n  Define isCC MT == B0\n  Define bankLeftBtnPressed M1 == bankLeftBtn\n  Define bankRightBtnPressed M1 == bankRightBtn\n  Define soloBtnPressed M1 == soloBtn\n  Define isBankLeft curBank == bankLeft\n  Define isBankRight curBank == bankRight\n';
const TEMPLATE_POST = '\n\n  Sub setLED ID stat delay\n    Mat chanCom = 90 + recChan \n    snd chanCom ID stat +Ddelay\n  End\n  Sub LED_ON ID\n    Mat chanCom = 90 + recChan\n    snd chanCom ID ON\n  End\n  Sub LED_OFF ID\n    Mat chanCom = 90 + recChan\n    snd chanCom ID OFF\n  End\n  Sub getBtnField base index to\n    Mat I0 = base + index\n    Mat I0 = I0 - 1\n    If isBankLeft\n      ASS to = II0\n    Else\n      Ass to = JI0\n    End\n  End\n  Sub getOtherBtnField base index to\n    Mat I0 = base + index\n    Mat I0 = I0 - 1\n    If isBankLeft\n      ASS to = JI0\n    Else\n      Ass to = II0\n    End\n  End\n  Sub setDataField base index val\n    Mat I0 = base + index\n    Mat I0 = I0 - 1\n    Ass KI0 = val\n  End\n  Sub getDataField base index to\n    Mat I0 = base + index\n    Mat I0 = I0 - 1\n    Ass to = KI0\n  End\n  Sub getDataByButton base btnIdx to\n    getBtnField BtnRef btnIdx J0\n    getDataField base J0 to\n  End\n  Sub setDataByButton base btnIdx val\n    getBtnField BtnRef btnIdx J0\n    setDataField base J0 val\n  End\n  Sub fireBtn index val\n    getBtnField BtnRef index vRef\n    getDataField DataCC vRef vCC\n    getDataField DataChan vRef vChan\n    Mat chanCom = B0 + vChan\n    Snd chanCom vCC val\n  End\n  Sub getBtnSend index valcc valch\n    getBtnField BtnRef index vRef\n    getDataField DataCC vRef valcc\n    getDataField DataChan vRef valch\n  End\n  Sub fireBtnPressed index\n    getBtnSend index vCC vChan\n    getBtnField BtnSndVal index vVal\n    Snd vChan vCC vVal\n  End\n  Sub fireBtnRelease index\n    getBtnSend index vCC vChan\n    Mat I0 = vChan &amp; F0\n    If I0 == 90\n      Mat J0 = vChan &amp; 0F\n      Mat vChan = 80 + J0\n    End\n    Snd vChan vCC 0\n  End\n  Sub switchBtnStats targetBank\n    Ass curBank = targetBank\n    Ass J0 = 1\n    While J0 &lt; 19\n      getBtnField BtnRef J0 vRef\n      getOtherBtnField BtnRef J0 vOthRef\n      getDataField DataStat vRef vStat\n      getDataField DataStat vOthRef vOthStat\n      getBtnField BtnType J0 vType\n      If vRef != vOthRef \n        If vStat != vOthStat \n          setLED J0 vStat 0\n        End\n      End\n      If vType == sb\n        If vStat == ON\n            getBtnField BtnGroup J0 vGrp\n            Ass K0 = vGrp\n            Ass LK0 = J0\n        End\n      End\n      Mat J0 = J0 + 1\n    End\n  End\n  Sub handleSpecialKeys result\n    ASS result = FALSE\n    If bankLeftBtnPressed\n      If isBankRight\n        LED_ON bankLeftBtn\n        LED_OFF bankRightBtn\n        switchBtnStats bankLeft\n      end\n      ASS result = TRUE\n    End\n    If bankRightBtnPressed\n      if isBankLeft\n        LED_ON bankRightBtn\n        LED_OFF bankLeftBtn\n        switchBtnStats bankRight\n      End\n      ASS result = TRUE\n    End\n    If soloBtnPressed\n      ASS result = TRUE\n    End\n  End\n  Ass J0 = 1\n  While J0 &lt; 1B\n    LED_ON J0 \n    Mat K0 = J0 * $10\n    Mat K0 = K0 + $200\n    setLED J0 OFF K0\n    Mat J0 = J0 + 1\n  End\n  setLED bankLeftBtn ON $450\n  Ass curBank = bankLeft\nEnd \nIf NoteOn\n  handleSpecialKeys isXKey\n  If isXKey == FALSE \n    getBtnField BtnType M1 vType \n    If vType == bt\n      LED_ON M1\n      fireBtnPressed M1\n    Else\n      if vType == tb\n        fireBtnPressed M1\n        getBtnField BtnRef M1 vRef \n        getDataField DataStat vRef vStat \n        If vStat == ON\n          LED_OFF M1\n          setDataField DataStat vRef OFF\n        Else\n          LED_ON M1\n          setDataField DataStat vRef ON\n        End\n      Else\n        if vType == sb\n          fireBtnPressed M1\n        Else\n          LED_ON M1\n        End\n      End\n    End\n  End\nEnd\nIf NoteOff\n  If bankLeftBtnPressed\n  Else\n    If bankRightBtnPressed\n    else\n      if soloBtnPressed\n      else\n        getBtnField BtnType M1 vType\n        getBtnField BtnGroup M1 vGrp\n        If vType == bt \n          fireBtnRelease M1\n          LED_OFF M1\n        Else\n          If vType == ta \n            LED_OFF M1\n            ass K0 = vGrp\n            Ass tLen = LK0 \n            ass tLoop = 1\n            ass togCount = 0\n            while tLoop &lt;= tLen\n              mat K0 = vGrp + tLoop\n              Ass tbId = LK0\n              getDataByButton DataStat tbId vStat\n              mat togCount = togCount + vStat\n              mat tLoop = tLoop + 1\n            end\n            if togCount == tLen \n              ass tLoop = 1\n              while tLoop &lt;= tLen\n                mat K0 = vGrp + tLoop\n                Ass tbId = LK0\n                setDataByButton DataStat tbId OFF\n                LED_OFF tbId\n                fireBtnPressed tbId\n                mat tLoop = tLoop + 1\n              end\n            Else\n              ass tLoop = 1\n              while tLoop &lt;= tLen\n                mat K0 = vGrp + tLoop\n                Ass tbId = LK0\n                getBtnField BtnRef tbId vRef\n                getDataField DataStat vRef vStat\n                if vStat == OFF\n                  LED_ON tbId\n                  setDataField DataStat vRef ON\n                  fireBtnPressed tbId\n                end\n                mat tLoop = tLoop + 1\n              end\n            End\n          Else\n            If vType == sb \n              setDataByButton DataStat M1 ON\n              fireBtnRelease M1\n              Ass J0 = vGrp\n              Ass tbId = LJ0\n              If tbId != M1\n                If J0 &gt; 0\n                  LED_OFF tbId\n                  setDataByButton DataStat tbId OFF\n                End\n              End\n              Ass J0 = vGrp\n              ass LJ0 = M1\n              LED_ON M1\n            Else\n            End\n          End\n        End\n      End\n    End\n  End\nEnd\nIf isCC\n  If M1 &lt; 22 \n    getBtnField Ctrls M1 vCC\n    getBtnField CtrlChans M1 vChan\n    Mat I0 = B0 + vChan\n    Send I0 vCC M2\n    Block\n  End\nEnd\nNX = XX +B</string>\n</dict>\n</plist>';

const BANK_LEFT = "bankLeft";
const BANK_RIGHT = "bankRight";
const BUTTON_NUM = 24; //number of buttons for config creation
// button index offset for config creation.
// MAGIC VALUE!
// calculated: Number of controls before (24 Knobs) -1 because streambyter config indices are offset by 1 
const BUTTON_BASE = 23; 

const PUSH = "bt";
const TOGGLE = "tb";
const TOGGLE_ALL = "ta";
const RADIO = "sb"; //sb = select button as in streambyter config
const SLIDER = "slider";
const KNOB = "knob";
const SEND_CC = "CC";
const SEND_NOTE = "NT";

const SEND2CMD = {
    CC: 176, //0xB0 hex B0
    NT: 144, //0x90 hex 90
}

const CMD2SEND = {
    176: SEND_CC, //0xB0 hex B0
    144: SEND_NOTE, //0x90 hex 90
}

const TOGGLE_GROUP_MAX = 8;

function isButton(type) {
    return !(type == "slider" || type == "knob")
}

const NO_GROUP = 0;

const TYPE_2_CLASS = {
    bt: "push",
    tb: "toggle",
    sb: "rg",
    sb1: "rg1",
    sb2: "rg2",
    sb3: "rg3",
    sb4: "rg4",
    sb5: "rg5",
    sb6: "rg6",
    sb7: "rg7",
    sb8: "rg8",
    ta:  "tga",
    ta1: "tga1",
    ta2: "tga2",
    ta3: "tga3",
    ta4: "tga4",
    ta5: "tga5",
    ta6: "tga6",
    ta7: "tga7",
    ta8: "tga8",
    tb1: "tgg1",
    tb2: "tgg2",
    tb3: "tgg3",
    tb4: "tgg4",
    tb5: "tgg5",
    tb6: "tgg6",
    tb7: "tgg7",
    tb8: "tgg8",
}

const GROUP_PREFIX = {
    sb: 's',
    tb: 'bg',
    ta: 'bg',
}

function getClassForType(type, group) {
    const cls = TYPE_2_CLASS[type];
    return (group != null && group > 0) ? cls + group : cls;
}

var actBank = BANK_LEFT;
// display modus 
var showDuplicates = false;

const config = {
    bankLeft: [{
        cc: 1,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #1
    {
        cc: 2,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #2
    {
        cc: 3,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #3
    {
        cc: 4,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #4
    {
        cc: 5,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #5
    {
        cc: 6,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #6
    {
        cc: 7,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #7
    {
        cc: 8,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #8
    {
        cc: 9,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #9
    {
        cc: 10,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #10
    {
        cc: 11,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #11
    {
        cc: 12,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #12
    {
        cc: 13,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #13
    {
        cc: 14,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #14
    {
        cc: 15,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #15
    {
        cc: 16,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #16
    {
        cc: 17,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #17
    {
        cc: 18,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #18
    {
        cc: 19,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #19
    {
        cc: 20,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #20
    {
        cc: 21,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #21
    {
        cc: 22,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #22
    {
        cc: 23,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #23
    {
        cc: 24,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #24

    {
        cc: 25,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 26,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 27,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 28,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 29,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 30,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 31,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 32,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 33,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 34,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 35,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 36,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 37,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 38,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 39,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 40,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 41,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 42,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 43,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 44,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 45,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 46,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 47,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 48,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 49,
        ch: 1,
        send: SEND_CC,
        type: SLIDER
    }, // slider 1
    {
        cc: 50,
        ch: 1,
        send: SEND_CC,
        type: SLIDER
    }, // slider 2
    {
        cc: 51,
        ch: 1,
        send: SEND_CC,
        type: SLIDER
    }, // slider 3
    {
        cc: 52,
        ch: 1,
        send: SEND_CC,
        type: SLIDER
    }, // slider 4
    {
        cc: 53,
        ch: 1,
        send: SEND_CC,
        type: SLIDER
    }, // slider 5
    {
        cc: 54,
        ch: 1,
        send: SEND_CC,
        type: SLIDER
    }, // slider 6
    {
        cc: 55,
        ch: 1,
        send: SEND_CC,
        type: SLIDER
    }, // slider 7
    {
        cc: 56,
        ch: 1,
        send: SEND_CC,
        type: SLIDER
    }, // slider 8
    {
        cc: 57,
        ch: 1,
        send: SEND_CC,
        type: SLIDER
    }, // slider 9, master
    ],

    bankRight: [{
        cc: 1,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #1
    {
        cc: 2,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #2
    {
        cc: 3,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #3
    {
        cc: 4,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #4
    {
        cc: 5,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #5
    {
        cc: 6,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #6
    {
        cc: 7,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #7
    {
        cc: 8,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #8
    {
        cc: 9,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #9
    {
        cc: 10,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #10
    {
        cc: 11,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #11
    {
        cc: 12,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #12
    {
        cc: 13,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #13
    {
        cc: 14,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #14
    {
        cc: 15,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #15
    {
        cc: 16,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #16
    {
        cc: 17,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #17
    {
        cc: 18,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #18
    {
        cc: 19,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #19
    {
        cc: 20,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #20
    {
        cc: 21,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #21
    {
        cc: 22,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #22
    {
        cc: 23,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #23
    {
        cc: 24,
        ch: 1,
        send: SEND_CC,
        type: KNOB
    }, // Knob #24

    {
        cc: 25,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 26,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 27,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 28,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 29,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 30,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 31,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 32,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 33,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 34,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 35,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 36,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 37,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 38,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 39,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 40,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 41,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 42,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 43,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 44,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 45,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 46,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 47,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 48,
        ch: 1,
        vl: 127,
        type: PUSH,
        group: 0,
        send: SEND_CC
    }, {
        cc: 49,
        ch: 1,
        send: SEND_CC,
        type: SLIDER
    }, // slider 1
    {
        cc: 50,
        ch: 1,
        send: SEND_CC,
        type: SLIDER
    }, // slider 2
    {
        cc: 51,
        ch: 1,
        send: SEND_CC,
        type: SLIDER
    }, // slider 3
    {
        cc: 52,
        ch: 1,
        send: SEND_CC,
        type: SLIDER
    }, // slider 4
    {
        cc: 53,
        ch: 1,
        send: SEND_CC,
        type: SLIDER
    }, // slider 5
    {
        cc: 54,
        ch: 1,
        send: SEND_CC,
        type: SLIDER
    }, // slider 6
    {
        cc: 55,
        ch: 1,
        send: SEND_CC,
        type: SLIDER
    }, // slider 7
    {
        cc: 56,
        ch: 1,
        send: SEND_CC,
        type: SLIDER
    }, // slider 8
    {
        cc: 57,
        ch: 1,
        send: SEND_CC,
        type: SLIDER
    }, // slider 9, master
    ]
}


//toggle all buttons and buttons out of their grop and their bank of usage
var toggleGroups = null;

// bank ouf usage for radio buttons
var selectionGroups = null;


resetButtonGroups();
function resetButtonGroups(){
    toggleGroups = ["empty", //for index reasons
        { bank:null, taCount: 0, btns: []}, // group 1
        { bank:null, taCount: 0, btns: []}, // group 2
        { bank:null, taCount: 0, btns: []}, // group 3
        { bank:null, taCount: 0, btns: []}, // group 4
        { bank:null, taCount: 0, btns: []}, // group 5
        { bank:null, taCount: 0, btns: []}, // group 6
        { bank:null, taCount: 0, btns: []}, // group 7
        { bank:null, taCount: 0, btns: []}, // group 8
    ];

        selectionGroups = ["empty", //for index reasons
        { bank:null, sbCount: 0}, // group 1
        { bank:null, sbCount: 0}, // group 2
        { bank:null, sbCount: 0}, // group 3
        { bank:null, sbCount: 0}, // group 4
        { bank:null, sbCount: 0}, // group 5
        { bank:null, sbCount: 0}, // group 6
        { bank:null, sbCount: 0}, // group 7
        { bank:null, sbCount: 0}, // group 8
    ];

}

function loadConfig(bank) {
    const conf = config[bank];

    for (var i = 0; i < conf.length; i++) {
        const idx = i + 1;
        //hack, maybe clean later

        const ccin = document.getElementById('ccIn' + idx);
        ccin.value = conf[i].cc;

        const chin = document.getElementById('chIn' + idx);
        chin.value = conf[i].ch;
        
        if (isButton(conf[i].type)) {
            const vlin = document.getElementById('vlIn' + idx);
            vlin.value = conf[i].vl;

            const lbl = document.getElementById('btsd' + idx);
            lbl.innerHTML = conf[i].send;

            const btn = document.getElementById('btn' + idx);
            btn.className = "icon " + getClassForType(conf[i].type, conf[i].group);
        }
    }
}

loadConfig(BANK_LEFT);

// currently selected button while button menu is active
var selButton = null;
resetSelButton();
function resetSelButton(){
    selButton = {button:null, idx:0, bank:null};
}


function positionToSelected(menu){
    const rect = selButton.button.getBoundingClientRect();
    const win = selButton.button.ownerDocument.defaultView;

    var top = rect.top + win.pageYOffset
    var left = rect.left + win.pageXOffset
    
    const menuRect = menu.getBoundingClientRect();

    top = top - menuRect.height;
    left = left + (rect.width - menuRect.width) / 2

    if (left + menuRect.width > window.innerWidth + win.pageXOffset)
        left = win.pageXOffset + window.innerWidth - menuRect.width;
    if (left < win.pageXOffset)
        left = win.pageXOffset;

    menu.style.top = top.toString() + 'px';
    menu.style.left = left.toString() + 'px';

}

function showBtnMenu(btn) {
    if (selButton.button == btn) {
        //clicked same button, close menu
        hideBtnMenu();
    } else {
        if (selButton.button != null)
            selButton.button.classList.remove('selected');

        btn.classList.add('selected');

        selButton.button = btn;
        selButton.idx = getTargetIndex(btn);
        selButton.bank = actBank;
        
        // togglegroups, toggle all and selection groups are available on the same bank only
        // the are disabled, if they are already used on the other bank
        for(var i = 1; i < toggleGroups.length;i++){
            const tggBtn = document.getElementById('mntgg'+i);
            const tgaBtn = document.getElementById('mntga'+i);
            const tgroup = toggleGroups[i];
            
            if(tgroup.bank == null || tgroup.bank == actBank){
                tgaBtn.classList.remove('disabled');
                tgaBtn.parentElement.removeAttribute('title')
            } else {
                tgaBtn.classList.add('disabled');
                tgaBtn.parentElement.title = 'group used on other bank';                
            }
            
            if(tgroup.bank == null || (tgroup.bank == actBank && tgroup.btns.length < TOGGLE_GROUP_MAX)){
                tggBtn.classList.remove('disabled');
                tggBtn.parentElement.removeAttribute('title')
            } else {
                tggBtn.classList.add('disabled');
                tggBtn.parentElement.title = (tgroup.bank == actBank) ? 'max group size reached' : 'group used on other bank';
            }
        }

        for(var i = 1; i < selectionGroups.length;i++){
            const sBtn = document.getElementById('mnrg'+i);
            const sgroup = selectionGroups[i];
            
            if(sgroup.bank == null || sgroup.bank == actBank){
                sBtn.classList.remove('disabled');
                sBtn.parentElement.removeAttribute('title')
            } else {
                sBtn.classList.add('disabled');
                sBtn.parentElement.title = 'group used on other bank';                
            }
            
        }

        const btnMenu = document.getElementById('btnMenu')
        positionToSelected(btnMenu);        
        btnMenu.classList.remove('hidden')
    }
}

function hideBtnMenu() {
    if (selButton.button != null)
        selButton.button.classList.remove('selected')
    selButton.button = null;
    selButton.idx = 0;
    document.getElementById('btnMenu').classList.add('hidden')
}

function addHandlerToAll(query, type, handler) {
    document.querySelectorAll(query).forEach(item=>item.addEventListener(type, handler))
}

// sets the buttons new type and group and cleans up group dependencies.
// returns true when any changes were applied or false in case  group and type did not change
function setSelButtonType(newType, newGroup) {
    const newClass = getClassForType(newType, newGroup);

    const curType = config[actBank][selButton.idx].type;
    const curGroup = config[actBank][selButton.idx].group;
    const curClass = getClassForType(curType, curGroup);

    if (curClass != newClass) {
        if(curGroup != NO_GROUP){
            // clean up group dependencies
            switch(curType){
                case RADIO:{
                        const sGroup = selectionGroups[curGroup];
                        sGroup.sbCount--;
                        if( sGroup.sbCount == 0){
                            //important! if no buttons set, group is available for any bank!
                            sGroup.bank = null;
                        }                        
                    }
                    break;
                case TOGGLE_ALL: {
                        const tGroup = toggleGroups[curGroup];
                        tGroup.taCount--;
                        if(tGroup.btns.length == 0 && tGroup.taCount == 0){
                            //important! if no buttons set, group is available for any bank!
                            tGroup.bank = null;
                        }                        
                    }
                    break;
                case TOGGLE: {
                        // remove from old toggle group
                        const tGroup = toggleGroups[curGroup];
                        const idx = tGroup.btns.indexOf(selButton.idx);
                        if (idx >= 0) {
                            tGroup.btns.splice(idx, 1);
                            if(tGroup.btns.length == 0 && tGroup.taCount == 0){
                                //important! if no buttons set, group is available for any bank!
                                tGroup.bank = null;
                            }
                        }
                    }
                    break;
            }                
        }

        selButton.button.classList.remove(curClass);
        selButton.button.classList.add(newClass);
        config[actBank][selButton.idx].type = newType;
        config[actBank][selButton.idx].group = newGroup;
        return true;
    }
    return false;
}

document.getElementById('mnPush').addEventListener('click', e=>{
    setSelButtonType(PUSH, NO_GROUP);
    hideBtnMenu();
}
);

document.getElementById('mnToggle').addEventListener('click', e=>{
    setSelButtonType(TOGGLE, NO_GROUP);
    hideBtnMenu();
}
);

addHandlerToAll('.radio', 'click', e=>{
    const groupId = getTargetIdVal(e.target);
    if(setSelButtonType(RADIO, groupId)){
        selectionGroups[groupId].sbCount++;
        selectionGroups[groupId].bank = actBank;
    };
    hideBtnMenu();
}
);

addHandlerToAll('.toggleAll', 'click', e=>{
    const groupId = getTargetIdVal(e.target);
    if(setSelButtonType(TOGGLE_ALL, groupId)){
        toggleGroups[groupId].taCount++;
        toggleGroups[groupId].bank = actBank;
    };
    hideBtnMenu();
}
);

addHandlerToAll('.toggleGroup', 'click', e=>{
    const groupId = getTargetIdVal(e.target);
    if (!toggleGroups[groupId].btns.includes(selButton.idx)) {
        toggleGroups[groupId].btns.push(selButton.idx);
        toggleGroups[groupId].bank = actBank;
        setSelButtonType(TOGGLE, groupId);
    }
    hideBtnMenu();
}
);

function parseAnyInt(val){
    return parseInt(val.replace(/^\D+/g, ''));
}

function getTargetIdVal(target) {
    return parseAnyInt(target.id);
}

function getTargetIndex(target) {
    return parseAnyInt(target.id) - 1;
}

function checkAndSet(target, min, max, type, onSuccess = function(){}) {
    const val = parseInt(target.value);
    const idx = getTargetIndex(target);
    const oldVal = config[actBank][idx][type];
    
    if(val != oldVal){
        if (val < min || val > max) {
            // out of range, reset
            target.value = oldVal;
        } else {
            config[actBank][idx][type] = val;
            onSuccess(idx);
        }    
    }
}

function checkHighlights(idx){
    if(showDuplicates) {
        highlightDuplicates(idx);
    }
}

addHandlerToAll('.knobCC', 'blur', e=> checkAndSet(e.target, 0, 127, 'cc', checkHighlights));

addHandlerToAll('.knobCH', 'blur', e=>checkAndSet(e.target, 1, 16, 'ch', checkHighlights));

addHandlerToAll('.btnCC', 'blur', e=>checkAndSet(e.target, 0, 127, 'cc', checkHighlights));

addHandlerToAll('.btnCH', 'blur', e=>checkAndSet(e.target, 1, 16, 'ch', checkHighlights));

addHandlerToAll('.btnVL', 'blur', e=>checkAndSet(e.target, 0, 127, 'vl'));

addHandlerToAll('.sldCC', 'blur', e=>checkAndSet(e.target, 0, 127, 'cc', checkHighlights));

addHandlerToAll('.sldCH', 'blur', e=>checkAndSet(e.target, 1, 16, 'ch', checkHighlights));


/*
highlight structure:
{
    cc: [cc],
    ch: [ch],
    send: [send],
    idx: clickedCtrl
}

or null
*/
var actHighlight = null;

function setHighlights(hl){
    config[actBank].forEach( (c,i) => {
        const ctrl = document.getElementById('ctrl'+ (i+1));
        if( c.cc == hl.cc && c.ch == hl.ch && c.send == hl.send) {
            ctrl.classList.add('highlight');
        } else ctrl.classList.remove('highlight');
    });
}

function highlightDuplicates(idx){
    const conf = config[actBank][idx];
    const hl = {
        cc: conf.cc,
        ch: conf.ch,
        send: conf.send,
        idx: idx
    }    
    setHighlights(hl);
    actHighlight = hl;
}

function removeAllHighlights(){
    for(var i = 1; i < 58; i++){
        const ctrl = document.getElementById('ctrl'+i);
        ctrl.classList.remove('highlight');
    }
}

function updateHighlights(){
    if(actHighlight) setHighlights(actHighlight);
    else removeAllHighlights();
}


addHandlerToAll('.button .icon', 'click', e=>{
   if(!showDuplicates){ 
        showBtnMenu(e.target);
        e.stopPropagation();
   }
}
);

addHandlerToAll('.icon', 'click', e=>{
    if(showDuplicates){
        const idx = getTargetIndex(e.target.closest('.ctrl'))
        highlightDuplicates(idx);
        e.stopPropagation();
    }
}
);

addHandlerToAll('.btsd', 'click', e=>{
    const idx = getTargetIndex(e.target);
    const conf = config[actBank][idx];
    const act = conf.send;
    var newVal = (act == SEND_CC) ? SEND_NOTE : SEND_CC;
    e.target.innerHTML = newVal;
    conf.send = newVal;
    if(showDuplicates) highlightDuplicates(idx);
});

function switchBank(from, to) {
    actBank = to;
    document.getElementById(from).classList.remove('selected');
    document.getElementById(to).classList.add('selected');
    loadConfig(to);
    resetSelButton();
    if(showDuplicates) updateHighlights();
}

document.getElementById('bankLeft').addEventListener('click', e=>{
    if (actBank == BANK_RIGHT)
        switchBank(BANK_RIGHT, BANK_LEFT);
}
);

document.getElementById('bankRight').addEventListener('click', e=>{
    if (actBank == BANK_LEFT)
        switchBank(BANK_LEFT, BANK_RIGHT);
});


function createStreamByterConfig(){
    const result = {
        IBtnType:   [],
        IBtnGroup:  [],
        IBtnRef:    [],
        IBtnSndVal:   [],
        ICtrls:     [],  
        ICtrlChans: [],
        JBtnType:   [],
        JBtnGroup:  [],
        JBtnRef:    [],
        JBtnSndVal:   [],
        JCtrls:     [],  
        JCtrlChans: [],
        KDataCC:    Array(48),
        KDataChan:  Array(48),
    }
    
    function pushVal(key, val){
            result[key].push(val.toString(16));
    }
    
    function getCmd(ch, send){
        return (SEND2CMD[send] + ch - 1).toString(16);
    }
        
    const len = config[BANK_LEFT].length;
    
    var btnCnt = 0;
    for(var i = 0; i < len;i++){      
        // bank left and right are basically the same configuration, 
        // so where bank left has a button, bank right also have one.
        if(isButton(config[BANK_LEFT][i].type)){
            
            function getGroup(type, groupId){
                if(groupId == 0) return '0';
                return GROUP_PREFIX[type] + (groupId-1);
            }
            
            const confL = config[BANK_LEFT][i];
            pushVal('IBtnType', confL.type);
            pushVal('IBtnGroup', getGroup(confL.type, confL.group));
            pushVal('IBtnSndVal', confL.vl);
            
            const confR = config[BANK_RIGHT][i];
            pushVal('JBtnType', confR.type);
            pushVal('JBtnGroup', getGroup(confR.type, confR.group));
            pushVal('JBtnSndVal', confR.vl);
            
            //idx is btnCnt or btnCnt or rBtnCnt
            function checkToggle(bank, refKey, idx){

                function findReference(cc, ch, send){
                    const ccHx = cc.toString(16);
                    const cmdHx = getCmd(ch, send);
                    for (var j = 0; j < btnCnt; j++){
                        const rj = j+BUTTON_NUM;
                        if(result.KDataCC[j] == ccHx && result.KDataChan[j] == cmdHx) return j;
                        if(result.KDataCC[rj] == ccHx && result.KDataChan[rj] == cmdHx) return rj;
                    }
                    return -1;
                }
                
                function setToggleReference(){
                    const ref = findReference(config[bank][i].cc, config[bank][i].ch, config[bank][i].send);
                    if(ref >= 0) {
                        result.KDataCC[idx] = '0';
                        result.KDataChan[idx] = '0';  
                        pushVal(refKey, ref+1);
                        return true;                   
                    } else return false;
                }

//                if(config[bank][i].type == TOGGLE && setToggleReference()){
                if(setToggleReference()){
                   // if it is a toggle button and there is a reference to another button with the same cc/ch 
                   // than use that data slot as reference so that toggling status is shared between the buttons.
                   // setting is done in setToggleReference to avoid duplication of default case (no double button).
                   // condition could be "Not" and the else clause, but it is difficult to understand... 
                } else {
                    result.KDataCC[idx] = (config[bank][i].cc).toString(16);
                    //merge channel with send command, either B for cc or 9 for note
                    const cmd = getCmd(config[bank][i].ch, config[bank][i].send);
                    result.KDataChan[idx] = (cmd).toString(16);
                    pushVal(refKey, idx+1);
                }
            }
            
            checkToggle(BANK_LEFT, 'IBtnRef', btnCnt);
            btnCnt++; //ink buttonCnt here so that right bank will find reference
            checkToggle(BANK_RIGHT, 'JBtnRef', btnCnt + BUTTON_NUM);
        } else {
            pushVal('ICtrls', config[BANK_LEFT][i].cc);
            pushVal('ICtrlChans', config[BANK_LEFT][i].ch - 1);
            pushVal('JCtrls', config[BANK_RIGHT][i].cc);
            pushVal('JCtrlChans', config[BANK_RIGHT][i].ch - 1);
        }
    }

    //add toggle groups
    for(var i = 1; i < toggleGroups.length;i++){
        const tg = toggleGroups[i].btns;
        if(tg.length > 0){
            const tgBtns = tg.map(id => (id-BUTTON_BASE).toString(16));
            // add length to the beginning for stupid streambyter :-)
            tgBtns.unshift(tgBtns.length.toString(16)); //hex not really needed because it is 8 max, but anyway
            result['Lbg' + (i-1)] = tgBtns;
        }
    }
    
    // result is ready, now assemble the script
    var content = TEMPLATE_PRE + '\n';
    
    //todo: read receiving channel from gui
    // currently hardcoded here
    content = content + 'Alias 0 recChan\n';
    
    for(var key in result){
//        const line = key + ' = ' + result[key].toString().replace(/,/g, ', '); //add spaces after comma
        const line = 'Ass ' + key + ' = ' + result[key].toString().replace(/,/g, ' '); //replace commas with blanks as streambyter demands! :-)
        content = content + line + '\n';
    }
    content = content + TEMPLATE_POST;
    downloadFile(fileName, content);
}


function downloadFile(filename, content) {
  if (navigator.msSaveBlob)
    navigator.msSaveBlob(
      new Blob([content], { type: "text/csv;charset=utf-8;" }),
      filename
    );
  else {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(content)
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}

document.getElementById('download').addEventListener('click', e=>{
    hideBtnMenu();
    createStreamByterConfig();
}
);

document.getElementById('duplicates').addEventListener('click', e=>{
    hideBtnMenu();
    if(showDuplicates){
        removeAllHighlights();
        showDuplicates = false;
        e.target.classList.remove('selected');
        document.getElementById('midimix').classList.remove('duplicates')
        actHighlight = null;
    } else{
        showDuplicates = true;
        e.target.classList.add('selected');        
        document.getElementById('midimix').classList.add('duplicates')
    }
}
);

window.addEventListener('click', hideBtnMenu)

window.addEventListener('keyup', e => {
    if(e.key == 'Enter' && e.target?.tagName?.toLowerCase() === 'input'){
        e.target.blur();
    }
})

//dont close menu if clicked in menu area
document.getElementById('btnMenu').addEventListener('click', e=>e.stopPropagation());


// file loading

const defaultFileName = "midimix.sbr";
var fileName = defaultFileName;

function processFile(name, content){
    fileName = name;

    resetSelButton();
    resetButtonGroups();

    
    const parseResult = {
        IBtnType:   null,
        IBtnGroup:  null,
        IBtnRef:    null,
        IBtnSndVal:   null,
        ICtrls:     null,
        ICtrlChans: null,
        JBtnType:   null,
        JBtnGroup:  null,
        JBtnRef:    null,
        JBtnSndVal:   null,
        JCtrls:     null,
        JCtrlChans: null,
        KDataCC:    null,
        KDataChan:  null,
        Lbg0:       null,
        Lbg1:       null,
        Lbg2:       null,
        Lbg3:       null,
        Lbg4:       null,
        Lbg5:       null,
        Lbg6:       null,
        Lbg7:       null,
    }
    
    function parseEntry(entry){
        var phrase = 'Ass ' + entry + ' = ';
        const regex = new RegExp(phrase, 'i'); //use regex search to match case insensitive 
        const start = content.search(regex); 
        if(start < 0) return null;
        
        const valStart = start + phrase.length;
        const values = content.substring(valStart, content.indexOf('\n', valStart));
        return values.split(' ');
    }
    
    Object.keys(parseResult).forEach( key => {
            parseResult[key] = parseEntry(key);
    });
    
    // 24 knobs (L+R)
    for(var i = 0; i < 24; i++){
        config.bankLeft[i].cc = parseInt(parseResult.ICtrls[i], 16);
        config.bankLeft[i].ch = parseInt(parseResult.ICtrlChans[i], 16) +1;

        config.bankRight[i].cc = parseInt(parseResult.JCtrls[i], 16);
        config.bankRight[i].ch = parseInt(parseResult.JCtrlChans[i], 16) +1;
    }
    
    // 24 buttons (L+R)
    const BTN_OFFSET = 24;
    for(var i = 0; i < 24; i++){
        const ioffset = i + BTN_OFFSET;
        
        function configBank(bankId, typeId, groupId, valId, refId){
            const bank = config[bankId];
            const conf = bank[ioffset];
            conf.type = parseResult[typeId][i];
            const group = parseResult[groupId][i];
            if(  group == NO_GROUP) {
                conf.group = 0;
            } else {
                // s0-7 or bg0-7 means radio group 1-8 or togglegroup 1-8
                conf.group = parseAnyInt(group) + 1;
                
                if(conf.type == TOGGLE && group.startsWith('bg')){
                    // add to toggle group
                    const tg = toggleGroups[conf.group]
                    tg.bank = bankId;
                    tg.btns.push(ioffset);
                } else if (conf.type == TOGGLE_ALL){
                    // ink toggle group counter
                    const tg = toggleGroups[conf.group]
                    tg.bank = bankId;
                    tg.taCount++;                    
                } else if (conf.type == RADIO){
                    // ink toggle group counter
                    const sg = selectionGroups[conf.group]
                    sg.bank = bankId;
                    sg.sbCount++;                    
                }
            }
            conf.vl = parseInt(parseResult[valId][i], 16);
            
            //for cc and ch we have to follow reference to data
            const ref = parseInt(parseResult[refId][i], 16) - 1;
            conf.cc = parseInt(parseResult.KDataCC[ref], 16);
            
            const chanVal = parseInt(parseResult.KDataChan[ref], 16);
            const channel = chanVal & 0x0F;
            const send = chanVal & 0xF0;
            
            conf.send = CMD2SEND[send];
            conf.ch = channel+1;         
        }
        
        configBank(BANK_LEFT, 'IBtnType', 'IBtnGroup', 'IBtnSndVal', 'IBtnRef');
        configBank(BANK_RIGHT, 'JBtnType', 'JBtnGroup', 'JBtnSndVal', 'JBtnRef');
    }
    
    // 13 sliders (L+R)
    // knobs and slider definitions are in a single Ctrls array in streambyter, 
    // but in config here there are 24 buttons inbetween
    const SLIDER_OFFSET = 24; 
    
    for(var i = 24; i < 33; i++){
        const ioffset = i + SLIDER_OFFSET;
        config.bankLeft[ioffset].cc = parseInt(parseResult.ICtrls[i], 16);
        config.bankLeft[ioffset].ch = parseInt(parseResult.ICtrlChans[i], 16)+1;
        
        config.bankRight[ioffset].cc = parseInt(parseResult.JCtrls[i], 16);
        config.bankRight[ioffset].ch = parseInt(parseResult.JCtrlChans[i], 16)+1;
        
    }
    
    loadConfig(actBank);
    if(showDuplicates) updateHighlights();
}


function loadURL(url){
    if(url.endsWith('.sbr')){
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.send(null);
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                var type = request.getResponseHeader('Content-Type');
                if (type.indexOf("text") !== 1) {
                    const name = decodeURI(url.substring(url.lastIndexOf('/')+1, url.length));
                    processFile(name, request.responseText);
                }
            }
        }
    }
}


function loadFile(file){
    if(file){
        var reader = new FileReader();  
        reader.onload = function(event) {
            processFile(file.name, event.target.result);
        }        
        reader.readAsText(file,"UTF-8");
    }
}

var fileChooser = document.getElementById("fileChooser");
fileChooser.addEventListener( "change", function(e) {
      if (fileChooser.files.length > 0) loadFile(fileChooser.files[0]);
},false);

addHandlerToAll('.upload', 'click', () => {
   fileChooser.click(); 
});

// drag and drop
var isDragging = false;
var timeout = -1;

function dragStart(){
    document.body.classList.add('dragActive');
    isDragging = true;
}

function dragEnd(){
    document.body.classList.remove('dragActive');
}

// Setup the dnd listeners.
const dropZone = document.getElementById('dropZone');
  
dropZone.addEventListener('drop', e => {
    dragEnd();
    e.stopPropagation();
    e.preventDefault();

    
    var files = e.dataTransfer.files; 
    if(files.length > 0){
        loadFile(files[0]);
    } else {
        const url = e.dataTransfer.getData('URL');
        if(url) loadURL(url);
    }
}, false);

dropZone.addEventListener('dragover', function (e){
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    isDragging = true;
}, false);
  
window.addEventListener('dragenter', function(e){
    const types = e.dataTransfer.types;
    if(types.includes('Files') || types.includes('text/uri-list')) dragStart();
});

window.addEventListener('dragleave', function(e){
//    document.body.classList.add('dragActive');
    isDragging = false;
    clearTimeout(timeout);
    timeout = setTimeout( () => {
        if (!isDragging) {
            dragEnd();
        }
    }, 100);
});

window.addEventListener('dragover', function (e){
    isDragging = true;
    e.stopPropagation();
    e.preventDefault();
}), false;

window.addEventListener('drop', function(e){
    dragEnd();
    e.stopPropagation();
    e.preventDefault();
}, false);


document.documentElement.classList.remove('hidden');