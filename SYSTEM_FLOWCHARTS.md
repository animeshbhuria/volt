# System Flowcharts & Architecture Documentation
*VOLT Mobility L5 EV Mobile Platform - Technical Architecture Reference Manual*

---

## 1. High-Level System Architecture

This diagram illustrates the high-level boundaries of the VOLT Mobility mobile client, its state management stores, the mock API middleware, and local JSON databases, representing the prototype environment.

```mermaid
flowchart TB
    subgraph Client [Mobile Client Application - React Native / Expo]
        UI[UI Screens & Component Layers]
        Router[Expo Router File System]
        Zustand[(Zustand State Stores)]
        NetProv[Network Status Provider]
        ThemeProv[Theme Engine Context]
    end

    subgraph Simulation [Telemetry & API Simulation Layer]
        MockAPI[mockApi.ts - Simulated Latency Middleware]
        MockSignals[mockSignals.ts - Live Telemetry Simulator]
    end

    subgraph DataStore [Static JSON Databases]
        SigDB[(signals_db.json)]
        ReqDB[(requirements_db.json)]
        MsgDB[(can_messages_db.json)]
        ArchDB[(architecture_db.json)]
        RoleDB[(role_access_db.json)]
    end

    UI -->|Triggers Actions| Zustand
    UI -->|Navigates| Router
    Zustand -->|Invokes Mocks| MockAPI
    MockAPI -->|Pulls Constants| SigDB
    MockAPI -->|Pulls Metadata| MsgDB
    MockAPI -->|Simulates Faults / Latency| MockSignals
    UI -->|Search / Display Specs| DataStore
    NetProv -->|Provides Offline Flag| UI
    ThemeProv -->|Provides Color Tokens| UI
```

### Explanation
The client is structured as an offline-first hybrid shell built using Expo Router. State management is delegated to Zustand stores (`authStore`, `vehicleStore`, `alertStore`). In place of a live HTTP backend, network interactions route through `mockApi.ts`, which injects 300–900ms latency to simulate internet round-trip delays, pulling metadata and baseline values from local JSON databases representing the parsed CAN telemetry sheets.

- **Potential Failure Points**: Mock API fault injection (`simulateFault` toggle) simulates endpoint timeout states, handled by local screen error banners.
- **Security Considerations**: Authentication is simulated locally. Real deployment will require replacing local memory stores with Keychain/Keystore drivers.

---

## 2. Repository Architecture

The folder structure organizes files by feature and system layer, keeping application routing separated from logic and styling tokens.

```mermaid
graph TD
    src[src/] --> app[app/]
    src --> components[components/]
    src --> constants[constants/]
    src --> providers[providers/]
    src --> services[services/]
    src --> store[store/]
    src --> theme[theme/]
    src --> types[types/]

    app -->|Imports Views| components
    app -->|Consumes Session| store
    components -->|Reads Hooks| providers
    components -->|Reads Tokens| theme
    services -->|Simulates Responses| types
    store -->|Invokes Services| services
    store -->|Maintains State| types
    constants -->|Exports Configs| store
```

### Explanation
- **app/**: Configures directory-based routing files. Route-guard layouts authenticate users and segment routing contexts by role (`(customer)`, `(dealer)`, `(financier)`, `(oem)`).
- **components/**: Houses layout shells, charts, and reusable UI primitives.
- **store/**: Governs application state and handles async data processing.
- **services/**: Orchestrates mock endpoints and latency delays.
- **constants/**: Defines navigation metrics, role logins, and parses compile-time databases.

---

## 3. Request Lifecycle

The diagram shows the lifecycle of a user interaction (e.g., executing a remote command) from the UI layer to execution verification.

```mermaid
sequenceDiagram
    autonumber
    actor User as Customer / Admin
    participant UI as Screen UI / Components
    participant StepUp as Step-Up OTP Modal
    participant Store as Zustand Store
    participant MockAPI as mockApi.ts
    participant Event as Delayed Response Thread

    User->>UI: Press Remote Command (e.g., Find Vehicle)
    UI->>UI: Check Rate Limits (e.g., Ping Limit Check)
    alt Limit Exceeded
        UI-->>User: Alert (Rate Limit Exceeded)
    else Under Limit
        UI->>StepUp: Mount OTP Bottom Sheet
        User->>StepUp: Enter 4-digit code (1234)
        alt Invalid Code
            StepUp-->>User: Error Alert (Invalid OTP)
        else Valid Code
            StepUp->>UI: Verification Success (Dismiss Modal)
            UI->>Store: Dispatch Action
            Store->>MockAPI: sendRemoteCommand(CMD, VIN, Token)
            Note over MockAPI: Start Latency Delay (300-900ms)
            MockAPI-->>Store: Return Initial Status (QUEUED)
            Store-->>UI: Render QUEUED State (Stepping Node 1)
            par Polling Delay 1
                MockAPI->>Event: SetTimeout 1.5s
                Event->>Store: Update status to SENT
                Store-->>UI: Render SENT State (Stepping Node 2)
            and Polling Delay 2
                MockAPI->>Event: SetTimeout 2.5s
                Event->>Store: Update status to ACKNOWLEDGED
                Store-->>UI: Render ACKNOWLEDGED State (Stepping Node 3)
            end
        end
    end
```

### Explanation
When a remote command is triggered, the UI verifies rate limits. The user is prompted with an OTP step-up verification modal. Once verified, an async dispatcher calls the store, firing the simulated endpoint in `mockApi.ts`. The response completes via a set of cascading status updates (Queued $\to$ Sent $\to$ Acknowledged) simulating command delivery.

- **Potential Failure Points**: Script crashes if the OTP refs are out of sync or if state changes interrupt timer loops.
- **Performance considerations**: Uses React Native Reanimated animations for node transitions to prevent blocking the main JS thread during API loads.

---

## 4. Authentication Flow

This diagram illustrates the login workflow, device verification check, and role select logic used to determine route destinations.

```mermaid
flowchart TD
    Start[User Opens App] --> Guard{Session Persisted?}
    Guard -->|Yes| DevCheck{Device Verified?}
    Guard -->|No| Login[login.tsx - OTP Login Screen]

    Login -->|Input Phone & Send| OTPSent[60s Timer Starts & OTP Sent]
    OTPSent -->|Enter 1234| OTPCheck{OTP Valid?}
    OTPCheck -->|No| OTPError[Show Invalid OTP Alert] --> OTPSent
    OTPCheck -->|Yes| MatchUser{Phone in MOCK_USERS?}

    MatchUser -->|Yes| LoginStore[authStore: Set authenticated user session]
    MatchUser -->|No| RoleSelect[role-select.tsx - Select Role manually]
    RoleSelect -->|Select Role| LoginStore

    LoginStore --> DevCheck
    DevCheck -->|Yes| RouteDest{Role Route Select}
    DevCheck -->|No| DevVerify[device-verify.tsx - Fingerprint verification]
    DevVerify -->|Press Verify Device| RouteDest

    RouteDest -->|CUSTOMER| CustDash[/(customer) tab stack]
    RouteDest -->|DEALER| DealDash[/(dealer) stack]
    RouteDest -->|FINANCIER| FinDash[/(financier) stack]
    RouteDest -->|VOLT| OemDash[/(oem) stack]
```

### Explanation
Authentication uses a simulated SMS OTP gateway. After entering a valid phone number, the app verifies if it matches a pre-configured profile. If the number is unregistered, a role selector page is shown to let developers test other roles. Customers are filtered through a device fingerprint check (`device-verify.tsx`) before navigating to their layout stack.

- **Files Involved**: `login.tsx`, `role-select.tsx`, `device-verify.tsx`, `authStore.ts`.
- **Security Considerations**: Device fingerprint uses a hardcoded hash token representation `VOLT-DEV-A1B2C3D4` which must be replaced with a dynamic hardware key exchange during integration.

---

## 5. API Flow

This flowchart shows the pipeline of an API invocation inside the React Native frontend layer.

```mermaid
flowchart LR
    Component[Screen UI Component] -->|Invokes Store Dispatch| Action[Zustand Action]
    Action -->|API Endpoint Call| API[mockApi.ts Endpoint]
    API -->|Inject Delay| Delay[delay: Promise setTmeout]
    Delay -->|Check Fault Status| FaultCheck{simulateFault = true?}
    
    FaultCheck -->|Yes| APIErr[Throw Error: Simulated Fault]
    FaultCheck -->|No| APISuccess[Load Mock Database Record]
    
    APIErr -->|Reject Promise| Catch[Store Catch Block]
    APISuccess -->|Resolve Response| UpdateStore[Update Zustand Store State]
    
    Catch -->|Update error State| RenderErr[Renders ErrorState Component]
    UpdateStore -->|Trigger Rerender| RenderData[Renders dynamic data cards]
```

### Explanation
- **Files Involved**: `src/services/mockApi.ts`, state stores (`store/*.ts`), screen views.
- **Entry Point**: A screen component fires a store dispatch.
- **Exit Point**: Renders either a dynamic data display or the `<ErrorState>` retry component.
- **Performance considerations**: The random delay (300-900ms) matches realistic network latency, allowing developers to inspect load states.

---

## 6. Database Flow

The system uses locally stored JSON files as structured telemetry databases, mimicking tables in a relational database.

```mermaid
erDiagram
    REQUIREMENTS_DB {
        string id PK
        string category
        string requirement
        string priority
        string acceptanceCriteria
        string owner
        string release
    }
    SIGNALS_DB {
        string id PK
        string name
        string description
        string unit
        string dataType
        number min
        number max
        string ecu
        string bus
        string messageName
        string canId
        string notes
    }
    CAN_MESSAGES_DB {
        string id PK
        string name
        string txEcu
        string cycleTime
        number dlc
        string[] signals
    }
    ROLE_ACCESS_DB {
        string role PK
        string[] features
    }
    
    CAN_MESSAGES_DB ||--o{ SIGNALS_DB : "packs"
    ROLE_ACCESS_DB ||--o{ REQUIREMENTS_DB : "accesses"
```

### Explanation
The database schema maps relationships between CAN messages and telemetry signals. The JSON records are compiled during build-time from CSV sheets.
- **Queries**: Queried dynamically in `specifications.tsx` using native JS `.filter()` searches.

---

## 7. Component Interaction Diagram

This diagram maps how user interaction bubbles up through custom inputs, dynamic providers, state containers, and visual widgets.

```mermaid
flowchart TD
    subgraph UI_Layer [User Interface View Stack]
        Pages[Screen Router Pages]
        Layouts[ScreenHeader & RoleTabBar]
        Primitives[Card, Badge, Button, NeumorphicSwitch]
    end

    subgraph Providers [Context & Providers]
        ThemeContext[ThemeProvider - Light/Dark Colors]
        NetContext[NetworkProvider - NetInfo Offline Hook]
    end

    subgraph Logic [State & Telemetry Store]
        Stores[Zustand Stores - auth, vehicle, alert]
        Widgets[SOCArcGauge, CommandStatusCard, Charts]
    end

    Pages -->|Includes| Layouts
    Pages -->|Composes Layout| Primitives
    Pages -->|Mounts UI| Widgets
    Providers -->|Inject Colors| Pages
    Providers -->|Inject Network status| Pages
    Pages -->|Subscribes to| Stores
    Widgets -->|Derived values from| Stores
```

### Explanation
Components read theme values from `ThemeProvider` and network changes from `NetworkProvider`. Data-centric components like `SOCArcGauge` and `CommandStatusCard` subscribe directly to Zustand state updates, re-rendering whenever signal values are recalculated.

---

## 8. State Management Flow

This flowchart traces a Zustand state update loop, starting from user action to persistent local storage write.

```mermaid
flowchart TD
    UserAction[User edits profile / toggle theme] --> Action[Zustand Store Action Triggered]
    Action --> Mutate[State payload mutated inside store]
    Mutate --> StoreState[(Zustand Memory Store)]
    
    StoreState --> Subscribe[Active View subscription fires]
    Subscribe --> Rerender[Virtual DOM updates and rerenders UI]
    
    Mutate -->|Async hook| CacheWrite[AsyncStorage.setItem - Persistent cache write]
    CacheWrite --> Storage[(Local Device Storage)]
```

### Explanation
- **Libraries**: Zustand v5.
- **Persistence**: Store changes like theme preference are written to native `AsyncStorage` and reloaded on app startup.

---

## 9. Background Processes

This diagram represents scheduled tasks and listener loops executing in the background.

```mermaid
flowchart TB
    Start[App Starts] --> RegisterNet[NetInfo connection status listener]
    Start --> RegisterTelemetry[TCU Simulation Loop - setInterval]
    
    RegisterNet -->|Connection drops| NetChange[Trigger Network Status Banner]
    RegisterTelemetry -->|Update signals| TelemetryTick[Update active Vin signals state every 5s]
    
    Start --> CommandTracker[Command status execution timers]
    CommandTracker -->|QUEUED -> SENT| UpdateSent[Transition status node after 1.5s]
    CommandTracker -->|SENT -> ACK| UpdateAck[Transition status node after 2.5s]
```

### Explanation
Three background processes execute concurrently:
1. Network status checker listeners.
2. Simulated telemetry status loops updating signal data.
3. CommandStatus trackers simulating status delays for remote commands.

---

## 10. External Service Integration

This diagram maps integrations with native device features and external app wrappers.

```mermaid
flowchart LR
    App[Mobile App] -->|Linking.openURL| MapLink[Native Apple / Google Maps URL]
    App -->|mockApi.submitService| PhotoUpload[Upload attachment binary stub]
    App -->|useNetwork| ConnectionCheck[NetInfo Connection status verification]
```

### Explanation
- **Maps**: Uses native deep linking (`geo:latitude,longitude` or `maps://?q=`) to launch map navigation.
- **Payments & Analytics**: Marked out-of-scope for the frontend prototype.

---

## 11. Error Handling Flow

This flowchart traces exception propagation from simulated failure triggers to UI banners.

```mermaid
flowchart TD
    API[mockApi call executed] --> checkFault{simulateFault = true?}
    checkFault -->|Yes| throwExc[Throw API Fault Error]
    checkFault -->|No| resolveData[Resolve payload data]
    
    throwExc --> catchStore[Store catch block catches exception]
    catchStore --> updateErr[Update error state to error.message]
    
    updateErr --> checkRetry{Screen retry button pressed?}
    checkRetry -->|Yes| API
    checkRetry -->|No| ShowBanner[Keep showing ErrorState component]
```

### Explanation
If `simulateFault` is toggled, API calls reject immediately. The catcher sets the error state, prompting the screen to hide data and mount a styled retry banner.

---

## 12. Deployment Architecture

This diagram shows the local testing and production distribution architecture using Expo Application Services (EAS).

```mermaid
flowchart LR
    Dev[Developer Workstation] -->|Push code| Git[(Git repository)]
    Git -->|eas build command| EAS[Expo Application Services Cloud]
    EAS -->|iOS Build Machine| AppStore[Apple App Store / TestFlight]
    EAS -->|Android Build Machine| PlayStore[Google Play Console]
    
    AppStore -->|Install App| iPhone[Physical iOS Device]
    PlayStore -->|Install App| Android[Physical Android Device]
    EAS -->|Generate JS Bundle| UpdateServer[Expo OTA Update Server]
    UpdateServer -->|OTA Update| iPhone
```

### Explanation
The app deploys using EAS Build containers. The source code is uploaded to Expo Cloud build servers, compiling static packages for iOS App Store and Google Play Console distribution.

---

## 13. CI/CD Pipeline

This diagram shows the verification and deployment pipeline.

```mermaid
flowchart TD
    Commit[Developer commits code] --> Push[Git push to main branch]
    Push --> LintCheck[Run compiler check: npm run typecheck]
    
    LintCheck -->|Fails| Reject[Reject build & report errors]
    LintCheck -->|Passes| BuildTrigger[Trigger EAS remote build client]
    
    BuildTrigger --> Compile[Compile native modules]
    Compile --> Sign[Sign binary packages with credentials]
    Sign --> Release[Deploy OTA update / publish binaries]
```

### Explanation
The CI pipeline runs compilation checks (`tsc --noEmit`). On success, the EAS compiler packages static bundles for distribution.

---

## 14. Security Flow

The system flows matching user authorization levels and privacy protocols.

```mermaid
flowchart TD
    UserRequest[Remote Command / Telemetry Request] --> RoleVerify{User authenticated?}
    RoleVerify -->|No| Deny[Deny request & route to login]
    RoleVerify -->|Yes| ScopeCheck{Role has permission for resource?}
    
    ScopeCheck -->|No| Unauth[Deny action and log violation]
    ScopeCheck -->|Yes| StepUpRequired{Command requires step-up OTP?}
    
    StepUpRequired -->|Yes| AuthSheet[Trigger Step-Up OTP Verification Sheet]
    StepUpRequired -->|No| ExecuteCommand[Execute API task]
    
    AuthSheet --> OTPCheck{OTP valid?}
    OTPCheck -->|Yes| ExecuteCommand
    OTPCheck -->|No| DenyOTP[Show error & cancel command]
```

### Explanation
The security architecture enforces:
1. Authenticated session validation.
2. Role access filters (e.g., Financiers cannot view service creation forms).
3. Step-up OTP challenges for remote actions.

---

## 15. Data Flow Diagram

The telemetry flow from raw signal mapping to gauge rendering.

```mermaid
flowchart LR
    Excel[Excel DBC Sheet] -->|Compiled to| JSONDB[(signals_db.json)]
    JSONDB -->|Live Status mapping| GetValue[getLiveValue signal reader]
    GetValue -->|Format parameters| Format[formatTelemetry format function]
    Format -->|State Dispatch| StoreState[(useVehicleStore State)]
    StoreState -->|reanimated progress props| SVG[SOCArcGauge SVG path fill]
```

### Explanation
CAN signals are extracted at build time, filtered dynamically, and formatted into human-readable strings before driving the virtual SVG gauge paths.

---

## 16. Sequence Diagrams

### E2E Remote Command Lifecycle (Find Vehicle)

```mermaid
sequenceDiagram
    autonumber
    actor Customer as App User
    participant App as Mobile Client App
    participant Store as vehicleStore.ts
    participant API as mockApi.ts
    
    Customer->>App: Press "Find My Vehicle" Action
    App->>App: Show Step-Up OTP Sheet
    Customer->>App: Input Code "1234"
    App->>Store: Dispatch sendCommand('FIND_VEHICLE')
    Store->>API: sendRemoteCommand('FIND_VEHICLE', activeVin)
    Note over API: Start execution delay
    API-->>Store: Resolve intermediate status QUEUED
    Store-->>App: Display status card: QUEUED
    
    Note over API: 1.5 seconds elapse
    API-->>Store: Push state transition SENT
    Store-->>App: Display status card: SENT
    
    Note over API: 2.5 seconds elapse
    API-->>Store: Push state transition ACKNOWLEDGED
    Store-->>App: Display status card: ACKNOWLEDGED
```

---

## 17. Dependency Graph

This diagram shows the module import hierarchy across major codebase libraries.

```mermaid
graph TD
    React[react / react-native] --> Core[src/app/_layout.tsx]
    Expo[expo / expo-router] --> Core
    Reanimated[react-native-reanimated] --> CustomSVG[src/components/vehicle/SOCArcGauge.tsx]
    Zustand[Zustand] --> Stores[src/store/*.ts]
    Lucide[lucide-react-native] --> Icons[src/components/layout/ScreenHeader.tsx]
    NetInfo[NetInfo] --> NetProv[src/providers/NetworkProvider.tsx]
    SVG_Lib[react-native-svg] --> CustomSVG
```

### Explanation
- **Internal Libraries**: Custom UI components are imported by routing entry points.
- **External Libraries**: Standard React Native, Reanimated, and Svg utilities form the runtime environment.

---

## 18. Class Diagram (Interfaces)

This class diagram represents the core TypeScript interfaces governing the telematics schemas.

```mermaid
classDiagram
    class Vehicle {
        +string vin
        +string model
        +string variant
        +string regNumber
        +string ownerName
        +string dealerName
        +TcuStatus tcuStatus
        +Date lastSeen
    }
    class VehicleSignals {
        +number soc
        +number soh
        +number estimatedRange
        +number batteryVoltage
        +number packTempMin
        +number packTempMax
        +number packTempMean
        +number odometer
        +number speed
        +DriveMode driveMode
        +IgnitionState ignitionState
        +ChargingState chargingState
        +PlugStatus plugStatus
        +number aux12vVoltage
        +ImmobilizationStatus immobilizationStatus
        +boolean batteryFault
        +boolean mcuTempCutoff
        +boolean motorTempWarning
        +boolean vcuLowSOC
        +boolean thermalRunaway
        +boolean batteryOverVoltage
        +boolean batteryUnderVoltage
        +boolean deepDischarge
        +boolean cellImbalance
        +number whPerKm
        +number chargeSessionsLast30Days
        +number totalDistanceLast30Days
    }
    class VehicleStatus {
        +Vehicle vehicle
        +VehicleSignals signals
        +Date lastUpdated
    }
    class CommandResult {
        +string commandId
        +CommandType command
        +CommandStatus status
        +string reason
        +Record~CommandStatus_Date~ timestamps
    }

    VehicleStatus *-- Vehicle : Composes
    VehicleStatus *-- VehicleSignals : Composes
```

### Explanation
These typing files (`src/types/vehicle.ts`) establish compilation constraints, ensuring that simulated payloads conform strictly to runtime structures.

---

## 19. Execution Flow (Application Startup)

The startup and screen mount process.

```mermaid
flowchart TD
    Start[User launches app] --> CheckFonts[Load Fonts: Inter & JetBrains Mono]
    CheckFonts -->|Loading| ShowSplash[Render scale-animated Splash Screen]
    CheckFonts -->|Loaded| InitContext[Initialize Theme & Network Context]
    
    InitContext --> LoadStorage[Load cached login sessions from AsyncStorage]
    LoadStorage --> SessionCheck{User session active?}
    
    SessionCheck -->|Yes| RouteMain[Navigate directly to Home / Dashboard]
    SessionCheck -->|No| RouteLogin[Navigate to Login Screen]
    
    RouteMain --> DismissSplash[Hide Splash Screen]
    RouteLogin --> DismissSplash
```

### Explanation
- **Entry File**: `src/app/_layout.tsx`.
- **Exit File**: Mounts the routing layouts based on authenticated sessions.

---

## 20. End-to-End User Journey

A complete view of a user's flow through the platform.

```mermaid
flowchart TD
    Login[Login with OTP 1234] --> Dashboard[View Customer Dashboard]
    Dashboard --> ViewStatus[Click Live Status tab]
    
    ViewStatus --> BatteryTab[Review pack voltage & cell temps]
    ViewStatus --> PowertrainTab[Review MCU & motor temperatures]
    ViewStatus --> AllSignalsTab[Search CAN Signal Database]
    
    Dashboard --> ClickTrips[Navigate to Trip History]
    ClickTrips --> DateFilter[Filter range 7D / 30D / 90D]
    DateFilter --> Export[Export PDF summary report]
    
    Dashboard --> ActionFind[Trigger Find My Vehicle command]
    ActionFind --> VerifyOTP[Enter Step-Up OTP challenge]
    VerifyOTP --> ExecutionTracker[Track execution states: QUEUED -> SENT -> ACK]
    
    Dashboard --> Booking[Book routine service appointment]
```

### Explanation
The customer logs in, reviews live stats, inspects raw CAN signals, filters analytics reports, and triggers remote command sequences. All actions are isolated by user context and role configurations.
