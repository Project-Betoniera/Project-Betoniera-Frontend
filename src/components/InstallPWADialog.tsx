import { Body1, Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Subtitle2, Tab, TabList, makeStyles, shorthands } from "@fluentui/react-components";
import { useContext, useState } from "react";
import { createFluentIcon, MoreHorizontalRegular, MoreVerticalRegular, LineHorizontal3Regular, PhoneAddRegular } from "@fluentui/react-icons";
import { PwaContext } from "../context/PwaContext";

const chromePath: string[] = [
    "M95.506,152.511c0,31.426,25.567,56.991,56.994,56.991c31.425,0,56.99-25.566,56.99-56.991 c0-31.426-25.565-56.993-56.99-56.993C121.073,95.518,95.506,121.085,95.506,152.511z",
    "M283.733,77.281c0.444-0.781,0.436-1.74-0.023-2.513c-13.275-22.358-32.167-41.086-54.633-54.159 C205.922,7.134,179.441,0.012,152.5,0.012c-46.625,0-90.077,20.924-119.215,57.407c-0.643,0.804-0.727,1.919-0.212,2.81 l42.93,74.355c0.45,0.78,1.28,1.25,2.164,1.25c0.112,0,0.226-0.008,0.339-0.023c1.006-0.137,1.829-0.869,2.083-1.852 c8.465-32.799,38.036-55.706,71.911-55.706c2.102,0,4.273,0.096,6.455,0.282c0.071,0.007,0.143,0.01,0.214,0.01H281.56 C282.459,78.545,283.289,78.063,283.733,77.281z",
    "M175.035,224.936c-0.621-0.803-1.663-1.148-2.646-0.876c-6.457,1.798-13.148,2.709-19.889,2.709 c-28.641,0-55.038-16.798-67.251-42.794c-0.03-0.064-0.063-0.126-0.098-0.188L23.911,77.719c-0.446-0.775-1.272-1.25-2.165-1.25 c-0.004,0-0.009,0-0.013,0c-0.898,0.005-1.725,0.49-2.165,1.272C6.767,100.456,0,126.311,0,152.511 c0,36.755,13.26,72.258,37.337,99.969c23.838,27.435,56.656,45.49,92.411,50.84c0.124,0.019,0.248,0.027,0.371,0.027 c0.883,0,1.713-0.47,2.164-1.25l42.941-74.378C175.732,226.839,175.657,225.739,175.035,224.936z",
    "M292.175,95.226h-85.974c-1.016,0-1.931,0.615-2.314,1.555c-0.384,0.94-0.161,2.02,0.564,2.73 c14.385,14.102,22.307,32.924,22.307,53c0,15.198-4.586,29.824-13.263,42.298c-0.04,0.058-0.077,0.117-0.112,0.178l-61.346,106.252 c-0.449,0.778-0.446,1.737,0.007,2.513c0.449,0.767,1.271,1.237,2.158,1.237c0.009,0,0.019,0,0.028,0 c40.37-0.45,78.253-16.511,106.669-45.222C289.338,231.032,305,192.941,305,152.511c0-19.217-3.532-37.956-10.498-55.698 C294.126,95.855,293.203,95.226,292.175,95.226z"
];

const safariPath: string[] = [
    "m12.71 11.96v.016c0 .225-.084.431-.222.588l.001-.001c-.13.156-.325.255-.542.255-.005 0-.01 0-.015 0h.001c-.005 0-.01 0-.016 0-.225 0-.431-.084-.588-.222l.001.001c-.156-.13-.255-.325-.255-.542 0-.005 0-.01 0-.015v.001c0-.004 0-.009 0-.014 0-.227.087-.434.229-.589l-.001.001c.134-.156.331-.254.551-.254h.009.01c.223 0 .427.084.581.222l-.001-.001c.157.13.256.325.256.544v.013-.001zm.2.777 4.69-7.782q-.121.107-.904.837t-1.68 1.56-1.828 1.701-1.567 1.48c-.242.216-.463.441-.668.68l-.008.009-4.674 7.768q.094-.094.898-.83t1.687-1.56q.88-.824 1.822-1.701t1.563-1.486q.63-.613.67-.676zm8.666-.737v.061c0 1.817-.519 3.513-1.416 4.947l.023-.039-.228-.147q-.187-.121-.355-.221c-.063-.046-.137-.081-.217-.1l-.004-.001c-.007-.001-.015-.002-.022-.002-.085 0-.154.069-.154.154 0 .008.001.016.002.023v-.001q0 .134.79.59c-.671 1.007-1.492 1.854-2.442 2.531l-.029.02c-.921.664-2.002 1.175-3.17 1.466l-.065.014-.214-.895q-.014-.134-.201-.134c-.048.001-.089.031-.107.073v.001c-.018.028-.029.061-.029.098 0 .01.001.021.003.031v-.001l.214.91c-.583.126-1.252.198-1.938.198-.006 0-.013 0-.019 0h.001c-.008 0-.017 0-.026 0-1.835 0-3.547-.524-4.996-1.43l.04.023q.014-.026.174-.274t.288-.449c.056-.072.099-.157.126-.249l.001-.005c.001-.007.002-.015.002-.022 0-.085-.069-.154-.154-.154-.008 0-.016.001-.023.002h.001q-.08 0-.228.194c-.1.133-.2.284-.29.441l-.011.021q-.154.268-.181.308c-1.016-.681-1.87-1.515-2.55-2.481l-.02-.03c-.666-.932-1.176-2.028-1.461-3.21l-.013-.064.922-.202c.079-.023.135-.094.135-.179 0-.008 0-.016-.001-.023v.001c-.001-.048-.031-.089-.073-.107h-.001c-.03-.018-.067-.029-.106-.029-.012 0-.024.001-.036.003h.001l-.91.201c-.116-.559-.183-1.202-.185-1.86v-.002c0-.019 0-.041 0-.063 0-1.861.544-3.594 1.482-5.05l-.022.037q.026.014.248.16t.4.254c.067.048.145.085.23.106l.005.001q.174 0 .174-.16 0-.08-.167-.207c-.124-.093-.266-.188-.413-.276l-.022-.012-.268-.16c.691-1 1.532-1.841 2.5-2.511l.032-.021c.932-.651 2.026-1.147 3.205-1.42l.063-.012.201.898q.026.134.201.134c.048-.001.089-.031.107-.073v-.001c.018-.03.029-.067.029-.106 0-.012-.001-.024-.003-.036v.001l-.201-.88c.537-.108 1.157-.173 1.791-.178h.005.037c1.869 0 3.611.544 5.076 1.483l-.038-.023c-.206.251-.381.538-.514.847l-.009.023q0 .174.16.174.147 0 .64-.857c1.95 1.336 3.366 3.328 3.938 5.652l.014.066-.75.16q-.134.026-.134.214c.001.048.031.089.073.107h.001c.028.018.061.029.098.029.01 0 .021-.001.031-.003h-.001l.763-.174c.118.563.187 1.21.19 1.873v.003zm1.138 0c0-.01 0-.022 0-.035 0-1.493-.313-2.913-.877-4.197l.026.067c-1.093-2.588-3.111-4.606-5.63-5.673l-.069-.026c-1.229-.538-2.66-.85-4.165-.85s-2.937.313-4.234.877l.069-.027c-2.588 1.093-4.605 3.111-5.672 5.63l-.026.069c-.538 1.229-.85 2.66-.85 4.165s.313 2.937.877 4.234l-.027-.069c1.093 2.588 3.111 4.605 5.63 5.672l.069.026c1.229.538 2.66.85 4.165.85s2.937-.313 4.234-.877l-.069.027c2.588-1.093 4.605-3.111 5.672-5.629l.026-.069c.538-1.218.85-2.637.85-4.13 0-.012 0-.025 0-.037v.002zm1.286 0v.033c0 1.672-.35 3.263-.981 4.703l.029-.075c-1.222 2.903-3.485 5.166-6.311 6.359l-.077.029c-1.375.601-2.977.951-4.661.951s-3.286-.35-4.738-.981l.077.03c-2.903-1.222-5.166-3.485-6.359-6.311l-.029-.077c-.601-1.375-.951-2.977-.951-4.661s.35-3.286.981-4.738l-.03.077c1.222-2.903 3.485-5.166 6.311-6.359l.077-.029c1.375-.601 2.977-.951 4.661-.951s3.286.35 4.738.981l-.077-.03c2.903 1.222 5.166 3.485 6.359 6.311l.029.077c.601 1.364.951 2.955.951 4.627v.035-.002z"
];

const edgePath: string[] = [
    "M15.95 1.079c0.007 0 0.014 0 0.022 0 1.469 0 2.896 0.178 4.261 0.513l-0.122-0.025c1.453 0.341 2.732 0.835 3.919 1.478l-0.082-0.041c1.251 0.682 2.327 1.484 3.276 2.414l-0.002-0.002c0.975 0.964 1.8 2.076 2.439 3.301l0.035 0.073c0.375 0.7 0.699 1.514 0.931 2.366l0.019 0.083c0.222 0.77 0.35 1.654 0.35 2.568 0 0.011-0 0.022-0 0.033v-0.002c0 0.010 0 0.022 0 0.034 0 0.744-0.105 1.464-0.301 2.145l0.013-0.055c-0.412 1.363-1.192 2.511-2.225 3.365l-0.012 0.009c-0.522 0.432-1.119 0.801-1.764 1.081l-0.048 0.019c-0.396 0.182-0.859 0.337-1.342 0.442l-0.046 0.008c-0.435 0.103-0.935 0.162-1.449 0.162h-0q-0.525 0-1.212-0.037c-0.515-0.030-0.988-0.083-1.452-0.161l0.078 0.011c-0.504-0.092-0.945-0.213-1.369-0.368l0.057 0.018c-0.405-0.149-0.754-0.361-1.053-0.628l0.003 0.003c-0.11-0.086-0.205-0.185-0.285-0.296l-0.003-0.004c-0.077-0.116-0.123-0.259-0.125-0.412v-0c0.018-0.171 0.091-0.322 0.2-0.438l-0 0c0.143-0.18 0.287-0.384 0.42-0.596l0.017-0.029c0.172-0.245 0.323-0.525 0.44-0.822l0.010-0.027c0.127-0.331 0.201-0.714 0.201-1.114 0-0.026-0-0.051-0.001-0.077l0 0.004c0-0.018 0-0.038 0-0.059 0-0.865-0.184-1.687-0.515-2.428l0.015 0.038c-0.349-0.787-0.794-1.464-1.33-2.056l0.006 0.006c-0.549-0.613-1.174-1.142-1.863-1.578l-0.036-0.021c-0.642-0.419-1.38-0.794-2.158-1.086l-0.079-0.026c-0.61-0.227-1.334-0.418-2.080-0.54l-0.069-0.009c-0.659-0.111-1.418-0.175-2.192-0.175-0.003 0-0.005 0-0.008 0h0c-1.364 0.001-2.68 0.206-3.918 0.587l0.094-0.025c-1.315 0.395-2.458 0.988-3.462 1.756l0.026-0.019c0.61-1.495 1.37-2.785 2.287-3.945l-0.026 0.034c0.902-1.131 1.94-2.102 3.101-2.905l0.048-0.031c1.113-0.772 2.398-1.406 3.774-1.835l0.1-0.027c1.316-0.412 2.83-0.65 4.399-0.65 0.026 0 0.053 0 0.079 0l-0.004-0zM8.952 21.736c0 0.004 0 0.010 0 0.015 0 0.949 0.123 1.87 0.354 2.747l-0.017-0.075c0.249 0.966 0.583 1.81 1.005 2.599l-0.030-0.062c0.451 0.841 0.966 1.567 1.558 2.221l-0.008-0.009c0.602 0.668 1.284 1.246 2.035 1.726l0.040 0.024c-1.305-0.178-2.485-0.501-3.595-0.96l0.096 0.035c-1.184-0.493-2.204-1.067-3.146-1.744l0.046 0.032c-0.976-0.708-1.828-1.489-2.584-2.356l-0.016-0.018c-0.734-0.85-1.39-1.805-1.934-2.828l-0.041-0.083c-0.511-0.953-0.943-2.060-1.24-3.22l-0.022-0.104c-0.286-1.072-0.45-2.302-0.45-3.57 0-0.010 0-0.020 0-0.030v0.002c-0-0.014-0-0.030-0-0.047 0-0.659 0.148-1.283 0.411-1.842l-0.011 0.026c0.273-0.592 0.621-1.1 1.039-1.539l-0.002 0.002c0.438-0.453 0.93-0.85 1.467-1.181l0.032-0.019c0.48-0.298 1.036-0.576 1.618-0.801l0.069-0.024c0.534-0.203 1.165-0.373 1.817-0.48l0.058-0.008c0.582-0.095 1.253-0.149 1.936-0.15h0.001c0.627 0.001 1.242 0.046 1.844 0.133l-0.069-0.008c0.671 0.113 1.26 0.265 1.828 0.461l-0.079-0.024c0.643 0.22 1.188 0.46 1.708 0.741l-0.059-0.029c0.55 0.308 1.025 0.652 1.456 1.043l-0.006-0.006c-0.31 0-0.612 0.032-0.904 0.092l0.029-0.005c-0.307 0.067-0.579 0.166-0.831 0.296l0.019-0.009v-0.025c-0.572 0.26-1.066 0.569-1.511 0.934l0.012-0.009c-0.485 0.394-0.915 0.82-1.3 1.284l-0.012 0.015c-0.384 0.462-0.743 0.977-1.058 1.521l-0.029 0.054c-0.283 0.487-0.556 1.059-0.784 1.653l-0.028 0.084c-0.199 0.5-0.38 1.103-0.511 1.723l-0.014 0.076c-0.116 0.517-0.184 1.112-0.187 1.722v0.003zM28.321 23.323c0.126 0.002 0.237 0.060 0.312 0.149l0.001 0.001c0.073 0.084 0.119 0.192 0.125 0.311l0 0.001c-0.016 0.154-0.065 0.294-0.14 0.417l0.002-0.004-0.4 0.575-0.537 0.662-0.55 0.625q-0.262 0.312-0.475 0.525l-0.275 0.287c-0.5 0.453-1.047 0.881-1.623 1.267l-0.051 0.032c-0.568 0.387-1.223 0.766-1.906 1.096l-0.093 0.041c-0.608 0.293-1.33 0.566-2.078 0.777l-0.096 0.023c-0.624 0.184-1.341 0.293-2.083 0.3l-0.004 0c-0.013 0-0.029 0-0.045 0-0.74 0-1.451-0.128-2.111-0.364l0.044 0.014c-0.706-0.25-1.318-0.58-1.868-0.988l0.019 0.013c-0.577-0.428-1.078-0.909-1.512-1.447l-0.012-0.015c-0.423-0.524-0.805-1.114-1.123-1.742l-0.026-0.057c-0.29-0.572-0.539-1.238-0.711-1.934l-0.014-0.066c-0.158-0.627-0.25-1.346-0.25-2.087v-0c0-0 0-0 0-0.001 0-0.876 0.146-1.718 0.416-2.503l-0.016 0.054c0.293-0.859 0.661-1.602 1.111-2.288l-0.023 0.038c0.12 0.825 0.361 1.57 0.706 2.254l-0.019-0.042c0.361 0.715 0.786 1.331 1.281 1.882l-0.007-0.008c0.506 0.569 1.072 1.068 1.693 1.492l0.032 0.020c0.591 0.416 1.265 0.792 1.977 1.097l0.073 0.028c0.622 0.27 1.361 0.511 2.126 0.683l0.086 0.016c0.675 0.156 1.451 0.247 2.247 0.25h0.002c0.007 0 0.016 0 0.024 0 0.957 0 1.889-0.109 2.783-0.316l-0.083 0.016c0.975-0.216 1.835-0.526 2.639-0.929l-0.065 0.029 0.25-0.125z"
];

const firefoxPath: string[] = [
    "M 50.785817 0.0067603932 C 41.055409 5.7040712 37.748566 16.244814 37.445879 21.52728 C 37.894542 21.496408 38.339748 21.459656 38.796381 21.459656 A 19.56 19.56 0 0 1 55.776111 31.376597 A 13.38 13.38 0 0 0 46.431989 29.107197 C 60.372975 36.07719 56.632599 60.082255 37.312619 59.176256 A 17.24 17.24 0 0 1 32.270612 58.203656 C 31.891279 58.060989 31.512261 57.906239 31.132928 57.73824 C 30.913928 57.63924 30.694561 57.537973 30.478561 57.425973 C 25.749566 54.985976 21.837246 50.360364 21.349246 44.74637 C 21.349246 44.74637 23.138143 38.079384 34.158132 38.079384 C 35.349131 38.079384 38.756248 34.753202 38.820248 33.789203 L 38.818259 33.781247 C 38.803259 33.466247 32.058389 30.783274 29.428391 28.192277 C 28.029791 26.813585 27.364133 26.145668 26.775122 25.646411 A 11.59 11.59 0 0 0 26.765177 25.638455 A 11.59 11.59 0 0 0 25.776665 24.888618 A 17.97 17.97 0 0 1 25.667273 15.415214 A 28.7 28.7 0 0 0 16.337073 22.625185 L 16.319173 22.625185 C 14.783174 20.678187 14.892604 14.258082 14.980604 12.917083 A 6.928 6.928 0 0 0 13.685793 13.605263 A 28.22 28.22 0 0 0 9.898818 16.849252 A 33.84 33.84 0 0 0 6.2749375 21.197113 A 32.73 32.73 0 0 0 1.0758027 32.93594 L 1.0221008 33.192516 C 0.94910091 33.533515 0.68720992 35.240088 0.64220996 35.611088 C 0.64220996 35.640088 0.63526517 35.667613 0.63226517 35.696613 A 36.94 36.94 0 0 0 0.0037546171 41.040942 L 0.0037546171 41.239838 A 38.76 38.76 0 0 0 76.95453 47.793452 C 77.01953 47.293453 77.071558 46.798778 77.129558 46.293778 A 39.86 39.86 0 0 0 74.615516 26.823874 C 72.930583 22.773671 69.518249 18.402574 66.844659 17.020303 A 40.27 40.27 0 0 1 70.770861 28.779019 L 70.776828 28.844655 C 66.394832 17.924666 58.966094 13.514997 52.8961 3.9250066 C 52.589101 3.4400071 52.282169 2.9542438 51.983169 2.4412443 C 51.812169 2.1482446 51.676532 1.8846832 51.557532 1.6416834 A 7.053 7.053 0 0 1 50.978745 0.10620827 A 0.1 0.1 0 0 0 50.891231 0.0067603932 A 0.138 0.138 0 0 0 50.81764 0.0067603932 C 50.81264 0.0067603932 50.805739 0.014705183 50.799739 0.016705181 C 50.793739 0.018705179 50.780894 0.028616844 50.771894 0.03261684 L 50.785817 0.0067603932 z M 33.921446 22.135901 A 19.39 19.39 0 0 0 33.18951 22.356675 A 19.39 19.39 0 0 1 33.921446 22.135901 z M 30.478561 23.400878 A 19.39 19.39 0 0 0 29.786404 23.729056 A 19.39 19.39 0 0 1 30.478561 23.400878 z M 70.778817 28.818798 L 70.784784 28.860566 L 70.778817 28.856588 L 70.778817 28.818798 z M 29.949498 57.169398 C 30.130498 57.256398 30.300517 57.350929 30.486517 57.433929 L 30.514362 57.45183 C 30.326362 57.36183 30.137498 57.266731 29.949498 57.169398 z "
];

const safariSquareAndArrowUpPath: string[] = [
    "M17.334 10.7617L17.334 20.5078C17.334 22.5195 16.3086 23.5352 14.2676 23.5352L3.06641 23.5352C1.02539 23.5352 0 22.5195 0 20.5078L0 10.7617C0 8.75 1.02539 7.73438 3.06641 7.73438L6.00586 7.73438L6.00586 9.30664L3.08594 9.30664C2.10938 9.30664 1.57227 9.83398 1.57227 10.8496L1.57227 20.4199C1.57227 21.4355 2.10938 21.9629 3.08594 21.9629L14.2383 21.9629C15.2051 21.9629 15.7617 21.4355 15.7617 20.4199L15.7617 10.8496C15.7617 9.83398 15.2051 9.30664 14.2383 9.30664L11.3281 9.30664L11.3281 7.73438L14.2676 7.73438C16.3086 7.73438 17.334 8.75 17.334 10.7617Z",
    "M8.66211 15.8887C9.08203 15.8887 9.44336 15.5371 9.44336 15.127L9.44336 5.09766L9.38477 3.63281L10.0391 4.32617L11.5234 5.9082C11.6602 6.06445 11.8555 6.14258 12.0508 6.14258C12.4512 6.14258 12.7637 5.84961 12.7637 5.44922C12.7637 5.24414 12.6758 5.08789 12.5293 4.94141L9.22852 1.75781C9.0332 1.5625 8.86719 1.49414 8.66211 1.49414C8.4668 1.49414 8.30078 1.5625 8.0957 1.75781L4.79492 4.94141C4.64844 5.08789 4.57031 5.24414 4.57031 5.44922C4.57031 5.84961 4.86328 6.14258 5.27344 6.14258C5.45898 6.14258 5.67383 6.06445 5.81055 5.9082L7.28516 4.32617L7.94922 3.63281L7.89062 5.09766L7.89062 15.127C7.89062 15.5371 8.24219 15.8887 8.66211 15.8887Z"
];

const safariPlusAppPath: string[] = [
    "M16.8652 1.15234C15.8691 0.15625 14.4629 0 12.793 0L5.18555 0C3.54492 0 2.13867 0.15625 1.14258 1.15234C0.146484 2.14844 0 3.54492 0 5.18555L0 12.793C0 14.4629 0.146484 15.8594 1.14258 16.8555C2.13867 17.8516 3.54492 18.0078 5.20508 18.0078L12.793 18.0078C14.4629 18.0078 15.8691 17.8516 16.8652 16.8555C17.8613 15.8594 18.0078 14.4629 18.0078 12.793L18.0078 5.20508C18.0078 3.53516 17.8613 2.14844 16.8652 1.15234ZM16.4355 4.94141L16.4355 13.0664C16.4355 14.0723 16.3086 15.1172 15.7129 15.7031C15.127 16.2988 14.0723 16.4355 13.0664 16.4355L4.94141 16.4355C3.93555 16.4355 2.88086 16.2988 2.28516 15.7031C1.69922 15.1172 1.57227 14.0723 1.57227 13.0664L1.57227 4.9707C1.57227 3.93555 1.69922 2.89062 2.28516 2.29492C2.88086 1.70898 3.94531 1.57227 4.9707 1.57227L13.0664 1.57227C14.0723 1.57227 15.127 1.70898 15.7129 2.30469C16.3086 2.89062 16.4355 3.93555 16.4355 4.94141Z",
    "M4.48242 9.00391C4.48242 9.48242 4.82422 9.80469 5.32227 9.80469L8.19336 9.80469L8.19336 12.6855C8.19336 13.1738 8.51562 13.5156 8.99414 13.5156C9.48242 13.5156 9.82422 13.1836 9.82422 12.6855L9.82422 9.80469L12.7051 9.80469C13.1934 9.80469 13.5352 9.48242 13.5352 9.00391C13.5352 8.51562 13.1934 8.17383 12.7051 8.17383L9.82422 8.17383L9.82422 5.30273C9.82422 4.80469 9.48242 4.46289 8.99414 4.46289C8.51562 4.46289 8.19336 4.80469 8.19336 5.30273L8.19336 8.17383L5.32227 8.17383C4.81445 8.17383 4.48242 8.51562 4.48242 9.00391Z"
]

const safariMenubarDockRectanglePath: string[] = [
    "M1.04492 3.29102L1.04492 4.66797L21.9824 4.66797L21.9824 3.29102ZM3.06641 17.9785L19.9609 17.9785C22.0117 17.9785 23.0273 16.9727 23.0273 14.9609L23.0273 3.02734C23.0273 1.01562 22.0117 0 19.9609 0L3.06641 0C1.02539 0 0 1.01562 0 3.02734L0 14.9609C0 16.9727 1.02539 17.9785 3.06641 17.9785ZM3.08594 16.4062C2.10938 16.4062 1.57227 15.8887 1.57227 14.873L1.57227 3.11523C1.57227 2.09961 2.10938 1.57227 3.08594 1.57227L19.9414 1.57227C20.9082 1.57227 21.4551 2.09961 21.4551 3.11523L21.4551 14.873C21.4551 15.8887 20.9082 16.4062 19.9414 16.4062Z",
    "M4.19922 14.0137C4.19922 14.5215 4.55078 14.8633 5.06836 14.8633L17.9883 14.8633C18.5059 14.8633 18.8574 14.5215 18.8574 14.0137L18.8574 12.5488C18.8574 12.041 18.5059 11.6992 17.9883 11.6992L5.06836 11.6992C4.55078 11.6992 4.19922 12.041 4.19922 12.5488Z"
]

const firefoxAddToHomeScreenPath: string[] = [
    "M15.535,10.526L17.135,12.126C17.449,12.44 17.228,12.977 16.784,12.98L12.551,13L12,12.449L12.021,8.217C12.023,7.773 12.56,7.552 12.875,7.866L14.471,9.462L19.72,4.22C20.013,3.927 20.488,3.927 20.781,4.22C21.074,4.513 21.074,4.988 20.781,5.281L15.535,10.526Z",
    "M7.6,14H6.4L6,14.4V15.6L6.4,16H7.6L8,15.6V14.4L7.6,14Z",
    "M10.6,14H9.4L9,14.4V15.6L9.4,16H10.6L11,15.6V14.4L10.6,14Z",
    "M13.6,14H12.4L12,14.4V15.6L12.4,16H13.6L14,15.6V14.4L13.6,14Z",
    "M10.6,11H9.4L9,11.4V12.6L9.4,13H10.6L11,12.6V11.4L10.6,11Z",
    "M14.5,2H5.5C4.119,2 3,3.119 3,4.5V19.5C3,20.881 4.119,22 5.5,22H14.5C15.881,22 17,20.881 17,19.5V15.225C17,14.811 16.664,14.475 16.25,14.475C15.836,14.475 15.5,14.811 15.5,15.225V17H4.5V4.3L5.3,3.5H14.7L15.5,4.3V5C15.5,5.414 15.836,5.75 16.25,5.75C16.664,5.75 17,5.414 17,5V4.5C17,3.119 15.881,2 14.5,2ZM8.75,19H11.25C11.664,19 12,19.336 12,19.75C12,20.164 11.664,20.5 11.25,20.5H8.75C8.336,20.5 8,20.164 8,19.75C8,19.336 8.336,19 8.75,19Z"
]

const icons = {
    browsers: {
        chrome: {
            Icon: createFluentIcon("chrome", "310", chromePath)
        },
        safari: {
            Icon: createFluentIcon("safari", "24", safariPath),
            SquareAndArrowUp: createFluentIcon("squareAndArrowUp", "24", safariSquareAndArrowUpPath),
            PlusApp: createFluentIcon("plusApp", "18", safariPlusAppPath),
            MenubarDockRectangle: createFluentIcon("menubarDockRectangle", "23", safariMenubarDockRectanglePath)
        },
        edge: {
            Icon: createFluentIcon("edge", "32", edgePath)
        },
        firefox: {
            Icon: createFluentIcon("edge", "80", firefoxPath),
            AddToHomeScreen: createFluentIcon("addToHomeScreen", "22", firefoxAddToHomeScreenPath)
        }
    }
};

const useStyles = makeStyles({
    icon:{
        height: "1rem",
        width: "1rem"
    },
    tabList: {
        marginBottom: "1rem"
    },
    instructions: {
        display: "flex",
        flexDirection: "column",
        ...shorthands.gap("0.5rem")
    },
    section: {
        paddingLeft: '1rem',
        ...shorthands.margin(0, 0),
    }
});

export default function InstallPwaDialog() {
    const styles = useStyles();
    const { pwaPrompt: prompt, isPwa } = useContext(PwaContext);
    const [acknowledged, setAcknowledged] = useState(window.localStorage.getItem("isPwaDialogAcknowledged") === "true");
    const [installPromptFailed, setInstallPromptFailed] = useState(false);
    const [browser, setBrowser] = useState(getBrowser());

    function getBrowser() {
        if (navigator.userAgent.indexOf("Edg") != -1) { return "edge"; }
        else if (navigator.userAgent.indexOf("Chrome") != -1) { return "chrome"; }
        else if (navigator.userAgent.indexOf("Safari") != -1) { return "safari"; }
        else if (navigator.userAgent.indexOf("Firefox") != -1) { return "firefox"; }
        else { return "chrome"; }
    }

    const setAcknowledgedState = (enabled: boolean) => {
        if (enabled) {
            window.localStorage.setItem("isPwaDialogAcknowledged", "true");
        } else {
            window.localStorage.removeItem("isPwaDialogAcknowledged");
        }
        setAcknowledged(enabled);
    };

    async function promptInstall() {
        try {
            if (prompt === null) throw new Error("Prompt is null");

            const result = await prompt();
            if (result.outcome === "accepted") setAcknowledged(true);
        } catch (error) {
            console.error(error);
            setInstallPromptFailed(true);
        }
    }

    function renderTutorial() {
        function renderTutorialContent() {
            switch (browser) {
                case "chrome":
                    return (
                        <div className={styles.instructions}>
                            <Subtitle2>Desktop</Subtitle2>
                            <ol className={styles.section}>
                                <li><Body1>Apri il menu in alto a destra <MoreVerticalRegular className={styles.icon} /></Body1></li>
                                <li><Body1>Seleziona <b>Installa Calendar Exporter</b></Body1></li>
                                <li><Body1>Seleziona <b>Installa</b> nel popup</Body1></li>
                            </ol>
                            <Subtitle2>Android</Subtitle2>
                            <ol className={styles.section}>
                                <li><Body1>Apri il menu in alto a destra <MoreVerticalRegular className={styles.icon} /></Body1></li>
                                <li><Body1>Seleziona <b>Installa app</b></Body1></li>
                                <li><Body1>Seleziona <b>Installa</b> nel popup</Body1></li>
                            </ol>
                        </div>
                    );
                case "safari":
                    return (
                        <div className={styles.instructions}>
                            <Subtitle2>iOS</Subtitle2>
                            <ol className={styles.section}>
                                <li><Body1>Seleziona l'icona di condivisione <icons.browsers.safari.SquareAndArrowUp className={styles.icon} /></Body1></li>
                                <li><Body1>Scorri verso il basso</Body1></li>
                                <li><Body1>Seleziona <b>Aggiungi alla schermata Home</b> <icons.browsers.safari.PlusApp className={styles.icon} /></Body1></li>
                                <li><Body1>Seleziona <b>Aggiungi</b> in alto a destra</Body1></li>
                            </ol>
                            <Subtitle2>MacOS</Subtitle2>
                            <ol className={styles.section}>
                                <li><Body1>Seleziona l'icona di condivisione <icons.browsers.safari.SquareAndArrowUp className={styles.icon} /></Body1></li>
                                <li><Body1>Seleziona <b>Aggiungi al Dock</b> <icons.browsers.safari.MenubarDockRectangle className={styles.icon} /></Body1></li>
                                <li><Body1>Seleziona <b>Aggiungi</b> in alto a destra</Body1></li>
                            </ol>
                        </div>
                    );
                case "edge":
                    return (
                        <div className={styles.instructions}>
                            <Subtitle2>Desktop</Subtitle2>
                            <ol className={styles.section}>
                                <li><Body1>Apri il menu in alto a destra <MoreHorizontalRegular className={styles.icon} /></Body1></li>
                                <li><Body1>Seleziona <b>App</b></Body1></li>
                                <li><Body1>Seleziona <b>Installa Calendar Exporter</b> nel popup</Body1></li>
                            </ol>
                            <Subtitle2>Android</Subtitle2>
                            <ol className={styles.section}>
                                <li><Body1>Apri il menu in basso a destra <LineHorizontal3Regular className={styles.icon} /></Body1></li>
                                <li><Body1>Scorri a destra</Body1></li>
                                <li><Body1>Seleziona <b>Aggiungi al telefono</b> <PhoneAddRegular className={styles.icon} /></Body1></li>
                            </ol>
                        </div>
                    );
                case "firefox":
                    return (
                        <div className={styles.instructions}>
                            <Subtitle2>Desktop</Subtitle2>
                            <Body1>🤷 Le PWA non sono ancora disponibili per Firefox desktop</Body1>
                            <Subtitle2>Android</Subtitle2>
                            <ol className={styles.section}>
                                <li><Body1>Apri il menu in basso a destra <MoreVerticalRegular className={styles.icon} /></Body1></li>
                                <li><Body1>Scorri verso il basso</Body1></li>
                                <li><Body1>Seleziona <b>Installa</b> <icons.browsers.firefox.AddToHomeScreen className={styles.icon} /></Body1></li>
                            </ol>
                        </div>
                    );
                default:
                    return <Body1>Seleziona un browser</Body1>;
            }
        }

        return (
            <>
                <TabList className={styles.tabList} defaultSelectedValue={getBrowser()} appearance="transparent" onTabSelect={(_event, data) => { setBrowser(data.value as string); }}>
                    <Tab icon={<icons.browsers.chrome.Icon />} value="chrome">Chrome</Tab>
                    <Tab icon={<icons.browsers.safari.Icon />} value="safari">Safari</Tab>
                    <Tab icon={<icons.browsers.edge.Icon />} value="edge">Edge</Tab>
                    <Tab icon={<icons.browsers.firefox.Icon />} value="firefox">Firefox</Tab>
                </TabList>
                {renderTutorialContent()}
            </>
        );
    }

    const shouldShowTutorial = installPromptFailed || prompt === null;

    return (
        <Dialog open={!acknowledged && !isPwa} modalType="modal">
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>📲 Installa la nostra App!</DialogTitle>
                    <DialogContent>
                        {shouldShowTutorial ? renderTutorial() : "Installa l'app per accedere più velocemente al sito!"}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { promptInstall(); }} appearance="primary" disabled={shouldShowTutorial}>Installa</Button>
                        <DialogTrigger>
                            <Button onClick={() => { setAcknowledgedState(true); }} appearance={shouldShowTutorial ? "primary" : "secondary"}>Chiudi</Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}
