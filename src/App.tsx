import React, { useReducer, useEffect, useState, ChangeEvent } from 'react';
import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  Row,
  Space,
  Typography,
} from 'antd';
import styled from 'styled-components';
import { State, ActionType, Task, SubTask } from './Typescript/Type';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  padding: 16px 24px;
`;

/**
|--------------------------------------------------
| REDUCER
|--------------------------------------------------
*/

const initialState: State = {
  data: [],
};

function reducer(state: State, action: ActionType) {
  switch (action.type) {
    case 'createTask':
      state.data.push(action.payload);
      return { ...state };
    case 'delete':
      const arr1: Task[] = state.data;
      state.data = arr1.filter((value, index) => index !== action.payload);
      return { ...state };
    case 'duplicate':
      const arr2: Task = state.data[action.payload];
      state.data.push(arr2);
      return { ...state };
    case 'addsubtask':
      console.log(action.payload);
      const arr3: State = state;
      const obj: SubTask = {
        name: action.payload.value,
        idDone: false,
      };
      const subArray2: SubTask[] = arr3.data[action.payload.index].task;
      subArray2.push(obj);
      // arr3.data[action.payload.index].task.push(obj);
      state.data[action.payload.index].task = subArray2;
      console.log(arr3);
      return { ...arr3 };
    case 'deletesubtask':
      const arr4: State = state;
      let subArray1: SubTask[] = arr4.data[action.payload.MainIndex].task;
      subArray1 = subArray1.filter(
        (value, index) => index !== action.payload.SubInldex
      );
      arr4.data[action.payload.MainIndex].task = subArray1;
      return { ...arr4 };
    case 'maskasdone':
      console.log(action.payload);
      const arr5: State = state;
      const MainIndex: number = action.payload.MainIndex;
      const SubIndex: number = action.payload.SubInldex;
      let status: boolean = arr5.data[MainIndex].task[SubIndex].idDone;
      arr5.data[MainIndex].task[SubIndex].idDone = !status;
      return { ...arr5 };
    default:
      return state;
  }
}

/**
|--------------------------------------------------
| COMPONENT
|--------------------------------------------------
*/

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [MainTask, setMainTask] = useState<string>('');

  useEffect(() => {
    // console.log(state);
  }, [state]);
  /**
  |--------------------------------------------------
  | Main Task
  |--------------------------------------------------
  */

  // Delete Main Task
  const deleteMainTask = (index: number): void => {
    return dispatch({ type: 'delete', payload: index });
  };

  // Duplicate Main Task
  const duplicatemainTask = (index: number): void => {
    return dispatch({ type: 'duplicate', payload: index });
  };

  // Create Main Task (Reducer)
  const createTask = (name: string): void => {
    // console.log(name);
    const data: Task = {
      name: name,
      isAllDone: false,
      task: [],
    };
    dispatch({ type: 'createTask', payload: data });
  };

  // Render Each MainTask
  const MainTaskRender = (): any => {
    const render: any[] = [];
    const data: Task[] = state.data;
    data.map((value, index) => {
      render.push(
        <Space direction="vertical" key={index} style={{ marginTop: 24 }}>
          <Card
            title={value.name}
            style={{ width: 600 }}
            extra={
              <>
                <Button type="primary" onClick={() => duplicatemainTask(index)}>
                  Duplicate
                </Button>{' '}
                <Button
                  type="primary"
                  danger
                  onClick={() => deleteMainTask(index)}
                >
                  Delete
                </Button>
              </>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <Input
                  placeholder="Enter Subtask Name"
                  style={{ width: 400 }}
                  id={`input-${index}`}
                />
                <Button
                  type="primary"
                  onClick={(e: any) => createSubTask(index, e)}
                >
                  Add Subtask
                </Button>
              </Space>
              <Divider />
              {subTaskRender(index)}
            </Space>
          </Card>
        </Space>
      );
    });
    return render.map((value) => value);
  };

  /**
  |--------------------------------------------------
  | Sub Task
  |--------------------------------------------------
  */
  const createSubTask = (index: number, event: Event): void => {
    const element = document.getElementById(
      'input-' + index
    ) as HTMLInputElement;
    dispatch({
      type: 'addsubtask',
      payload: { index: index, value: element.value },
    });
  };

  const subTaskRender = (MainIndex: number): any => {
    const render: any[] = [];
    const data: Task = state.data[MainIndex];
    data.task.map((value, index) => {
      render.push(
        <Row key={index}>
          <Col span={16}>
            <Typography.Text
              style={
                value.idDone
                  ? { textDecoration: 'line-through' }
                  : { textDecoration: 'none' }
              }
            >
              {value.idDone ? value.name + ' (Done)' : value.name + ' (Todo)'}
            </Typography.Text>
          </Col>
          <Col span={8}>
            <Button type="primary" onClick={() => maskAsDone(MainIndex, index)}>
              {value.idDone ? 'Undo' : 'Done'}
            </Button>{' '}
            <Button
              type="primary"
              danger
              onClick={() => deleteSubTask(MainIndex, index)}
            >
              Delete
            </Button>
          </Col>
        </Row>
      );
    });
    return render.map((value) => value);
  };

  const deleteSubTask = (MainIndex: number, SubIndex: number): void => {
    return dispatch({
      type: 'deletesubtask',
      payload: { MainIndex: MainIndex, SubInldex: SubIndex },
    });
  };

  const maskAsDone = (MainIndex: number, SubIndex: number): void => {
    return dispatch({
      type: 'maskasdone',
      payload: { MainIndex: MainIndex, SubInldex: SubIndex },
    });
  };

  /**
  |--------------------------------------------------
  | Render
  |--------------------------------------------------
  */
  return (
    <Container>
      <Space>
        <Input
          style={{ width: 400 }}
          placeholder="Enter Task Name"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setMainTask(e.target.value)
          }
          value={MainTask}
        />
        <Button type="primary" onClick={() => createTask(MainTask)}>
          Create Task
        </Button>
      </Space>
      {MainTaskRender()}
    </Container>
  );
};

export default App;
