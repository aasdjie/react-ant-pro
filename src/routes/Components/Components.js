import React,{Component} from 'react';
import PropTypes from 'prop-types'
import { Table, Divider, Tag,Card,Button,Popconfirm,Input,Skeleton } from 'antd';
import TreeCheck from 'components/TreeCheck'; // aware of the relative path

export default class Components extends Component {
    constructor(props){
        super(props);
        console.log(props)

    }
    componentDidMount() {

    }


    onCheckedKeyChange = (checkedArrs)=>{
        console.log(checkedArrs);
    }

    render() {


        const treeDatas = [{
            title: '0-0',
            key: '0-0',
            children: [{
                title: '0-0-0',
                key: '0-0-0',
                children: [
                    { title: '0-0-0-0', key: '0-0-0-0' },
                    { title: '0-0-0-1', key: '0-0-0-1' },
                    { title: '0-0-0-2', key: '0-0-0-2' },
                ],
            }, {
                title: '0-0-1',
                key: '0-0-1',
                children: [
                    { title: '0-0-1-0', key: '0-0-1-0' },
                    { title: '0-0-1-1', key: '0-0-1-1' },
                    { title: '0-0-1-2', key: '0-0-1-2' },
                ],
            }, {
                title: '0-0-2',
                key: '0-0-2',
            }],
        }, {
            title: '0-1',
            key: '0-1',
            children: [
                { title: '0-1-0-0', key: '0-1-0-0' },
                { title: '0-1-0-1', key: '0-1-0-1' },
                { title: '0-1-0-2', key: '0-1-0-2' },
            ],
        }, {
            title: '0-2',
            key: '0-2',
        }];
        const treeData = [{
            label: '全部',
            value: 'all',
            children:[{
                label: '0-0',
                value: '00',
                children: [{
                    label: '0-0-0',
                    value: '000',
                    children: [
                        { label: '0-0-0-0-0-0-0-0-0-0-0', value: '0000' },
                        { label: '0-0-0-1', value: '0001' },
                        { label: '0-0-0-2', value: '0002' },
                    ],
                }, {
                    label: '0-0-1',
                    value: '001',
                    children: [
                        { label: '0-0-1-0', value: '0010' },
                        { label: '0-0-1-1', value: '0011' },
                        { label: '0-0-1-2', value: '0012' },
                    ],
                }, {
                    label: '0-0-2',
                    value: '002',
                }],
            }, {
                label: '0-1',
                value: '01',
                children: [
                    { label: '0-1-0-0', value: '0100' },
                    { label: '0-1-0-1', value: '0101' },
                    { label: '0-1-0-2', value: '0102' },
                ],
            }, {
                label: '0-2',
                value: '02',
            }]
        }];

        const columns = [{
            title: '参数	',
            dataIndex: 'Param',
            key: 'Param',
            render: text => <a href="javascript:;">{text}</a>,
        }, {
            title: '说明',
            dataIndex: 'explain',
            key: 'explain',
        }, {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
        }, {
            title: '默认值',
            key: 'Default',
            dataIndex: 'Default',
        }];

        const data = [{
            key: '1',
            Param: 'spanName', //参数
            explain: 'TreeCheck 添加标题', //说明
            type: 'string', //类型
            Default: '-', //默认值
        }, {
            key: '2',
            Param: 'treeData',
            explain: 'treeData 为 TreeCheck的JSON格式',
            type: 'array',
            Default: '[ ]',
        }, {
            key: '3',
            Param: 'isShowSearch',
            explain: '是否显示搜索框',
            type: 'bool',
            Default: 'false',
        }, {
            key: '4',
            Param: 'getAllNodes',
            explain: '是否选取所有节点 true:选取所有的节点，false：只选子节点',
            type: 'bool',
            Default: 'false',
        }, {
            key: '5',
            Param: 'divWidth',
            explain: 'TreeCheck的宽度',
            type: 'string',
            Default: '300px',
        },{
            key: '6',
            Param: 'divHeight', //参数
            explain: 'TreeCheck的高度', //说明
            type: 'string', //类型
            Default: '50px', //默认值
        }, {
            key: '7',
            Param: 'selectTop',
            explain: '下拉选框的距离button的高度',
            type: 'string',
            Default: '36px',
        }, {
            key: '8',
            Param: 'maxHeight',
            explain: '下拉选框的最大高度',
            type: 'string',
            Default: '400px',
        }, {
            key: '9',
            Param: 'checkedKeys',
            explain: '下拉选框默认选种的节点',
            type: 'array',
            Default: '[ ]',
        }, {
            key: '10',
            Param: 'LabelAndValue',
            explain: 'treeData中需要label和value两个值，若没有label和value，则该属性可以转化',
            type: 'array',
            Default: '["label","value"]',
        }, {
            key: '11',
            Param: 'onCheckedKeyChange',
            explain: 'TreeCheck 被选中节点时的回调',
            type: 'function(checkedArrs)',
            Default: '-',
        }];
        return (
            <div>
                <Card title="多选SelectTree"  bordered={false}>
                    <TreeCheck
                        treeData={treeData}
                        isShowSearch={true}
                        spanName={'多选Select：'}
                        getAllNodes={true}
                        //LabelAndValue={['title','key']}
                        onCheckedKeyChange={(checkedArrs) => this.onCheckedKeyChange(checkedArrs)}/>
                    <h3>API</h3>
                    <p>TreeCheck 为多选SelectTree，本组件为适应特殊场景而封装。</p>
                    <Table columns={columns} dataSource={data} />
                </Card>
            </div>
        );
    }
}

// 组件必须传递参数
Components.propTypes = {
    bordered:PropTypes.bool,
    // isShowSearch: PropTypes.bool,
    // spanName: PropTypes.string,
    // getAllNodes: PropTypes.bool,
    // divWidth: PropTypes.string,
    // divHeight: PropTypes.string,
    // selectTop: PropTypes.string,
    // checkedKeys: PropTypes.array, // 树默认选中的值
    // async: PropTypes.bool
};

// 设置默认属性
Components.defaultProps = {
    bordered:true,//是否展示外边框和列边框
};
