# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file '/users/danielcampbell/fluxhackdays/video2audio/convert_line.ui',
# licensing of '/users/danielcampbell/fluxhackdays/video2audio/convert_line.ui' applies.
#
# Created: Fri Jun 22 13:33:30 2018
#      by: pyside2-uic  running on PySide2 5.9.0a1
#
# WARNING! All changes made in this file will be lost!

from PySide2 import QtCore, QtGui, QtWidgets

class Ui_ConvertLine(object):
    def setupUi(self, convert_line):
        convert_line.setObjectName("convert_line")
        convert_line.setGeometry(QtCore.QRect(0, 0, 800, 57))
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.Preferred, QtWidgets.QSizePolicy.Fixed)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(convert_line.sizePolicy().hasHeightForWidth())
        convert_line.setSizePolicy(sizePolicy)
        convert_line.setMinimumSize(QtCore.QSize(800, 50))
        self.horizontalLayout_3 = QtWidgets.QHBoxLayout(convert_line)
        self.horizontalLayout_3.setObjectName("horizontalLayout_3")
        self.left_column = QtWidgets.QHBoxLayout()
        self.left_column.setObjectName("left_column")
        self.name_input = QtWidgets.QLineEdit(convert_line)
        self.name_input.setEnabled(True)
        self.name_input.setObjectName("name_input")
        self.left_column.addWidget(self.name_input)
        self.add_button = QtWidgets.QPushButton(convert_line)
        self.add_button.setObjectName("add_button")
        self.left_column.addWidget(self.add_button)
        self.horizontalLayout_3.addLayout(self.left_column)
        spacerItem = QtWidgets.QSpacerItem(100, 20, QtWidgets.QSizePolicy.Preferred, QtWidgets.QSizePolicy.Minimum)
        self.horizontalLayout_3.addItem(spacerItem)
        self.right_column = QtWidgets.QHBoxLayout()
        self.right_column.setObjectName("right_column")
        self.name_output = QtWidgets.QLineEdit(convert_line)
        self.name_output.setEnabled(True)
        self.name_output.setObjectName("name_output")
        self.right_column.addWidget(self.name_output)
        self.convert_button = QtWidgets.QPushButton(convert_line)
        self.convert_button.setObjectName("convert_button")
        self.right_column.addWidget(self.convert_button)
        self.horizontalLayout_3.addLayout(self.right_column)

        self.retranslateUi(convert_line)
        QtCore.QMetaObject.connectSlotsByName(convert_line)

    def retranslateUi(self, convert_line):
        convert_line.setWindowTitle(QtWidgets.QApplication.translate("ConvertLine", "Form", None, -1))
        self.add_button.setText(QtWidgets.QApplication.translate("ConvertLine", "Add", None, -1))
        self.convert_button.setText(QtWidgets.QApplication.translate("ConvertLine", "Convert", None, -1))

